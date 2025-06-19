import { ContactRepository } from '../repositories/contactRepository';
import Contact from '../models/Contact';

interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

export class IdentifyService {
  private contactRepository: ContactRepository;

  constructor() {
    this.contactRepository = new ContactRepository();
  }

  private async getPrimary(contact: Contact): Promise<Contact> {
    if (contact.linkPrecedence === 'primary') {
      return contact;
    }
    const primary = await this.contactRepository.findById(contact.linkedId!);
    if (!primary) {
      throw new Error('Primary contact not found');
    }
    return primary;
  }

  async identify({ email, phoneNumber }: IdentifyRequest): Promise<IdentifyResponse> {
    console.log(`Processing identify request - Email: ${email || 'none'}, Phone: ${phoneNumber || 'none'}`);

    if (!email && !phoneNumber) {
      throw new Error('At least one of email or phoneNumber must be provided');
    }

    const matchingContacts = await this.contactRepository.findByEmailOrPhone(email, phoneNumber);
    console.log(`Found ${matchingContacts.length} matching contacts`);

    if (matchingContacts.length === 0) {
      console.log('Creating new primary contact');
      const newContact = await this.contactRepository.createContact(
        email || null,
        phoneNumber || null,
        'primary',
        null
      );
      return {
        contact: {
          primaryContactId: newContact.id,
          emails: [newContact.email].filter(Boolean) as string[],
          phoneNumbers: [newContact.phoneNumber].filter(Boolean) as string[],
          secondaryContactIds: [],
        },
      };
    }

    const primaries = new Set<number>();
    for (const contact of matchingContacts) {
      const primary = await this.getPrimary(contact);
      primaries.add(primary.id);
    }
    console.log(`Found ${primaries.size} primary contacts`);

    let oldestPrimary: Contact | null = null;
    if (primaries.size > 1) {
      const primaryContacts = await Promise.all(
        Array.from(primaries).map((id) => this.contactRepository.findById(id))
      );
      const validPrimaries = primaryContacts.filter((c): c is Contact => c !== null);
      validPrimaries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      oldestPrimary = validPrimaries[0];

      for (let i = 1; i < validPrimaries.length; i++) {
        const otherPrimary = validPrimaries[i];
        await this.contactRepository.updateContact(otherPrimary, {
          linkPrecedence: 'secondary',
          linkedId: oldestPrimary.id,
        });
        await this.contactRepository.updateLinkedId(otherPrimary.id, oldestPrimary.id);
      }
    } else {
      oldestPrimary = await this.contactRepository.findById(Array.from(primaries)[0]);
    }

    if (!oldestPrimary) {
      throw new Error('Oldest primary not found');
    }

    let group = await this.contactRepository.findGroup(oldestPrimary.id);

    const emailsSet = new Set<string>();
    const phoneNumbersSet = new Set<string>();
    group.forEach((contact) => {
      if (contact.email) emailsSet.add(contact.email);
      if (contact.phoneNumber) phoneNumbersSet.add(contact.phoneNumber);
    });

    const newEmail = email && !emailsSet.has(email);
    const newPhoneNumber = phoneNumber && !phoneNumbersSet.has(phoneNumber);

    if (newEmail || newPhoneNumber) {
      console.log('Creating new secondary contact with new contact information');
      const newSecondary = await this.contactRepository.createContact(
        email || null,
        phoneNumber || null,
        'secondary',
        oldestPrimary.id
      );
      group.push(newSecondary);
      if (newSecondary.email) emailsSet.add(newSecondary.email);
      if (newSecondary.phoneNumber) phoneNumbersSet.add(newSecondary.phoneNumber);
    }

    const secondaryContacts = group.filter((c) => c.id !== oldestPrimary.id);
    return {
      contact: {
        primaryContactId: oldestPrimary.id,
        emails: [oldestPrimary.email, ...Array.from(emailsSet).filter((e) => e !== oldestPrimary.email)].filter(
          Boolean
        ) as string[],
        phoneNumbers: [
          oldestPrimary.phoneNumber,
          ...Array.from(phoneNumbersSet).filter((p) => p !== oldestPrimary.phoneNumber),
        ].filter(Boolean) as string[],
        secondaryContactIds: secondaryContacts.map((c) => c.id),
      },
    };
  }
}