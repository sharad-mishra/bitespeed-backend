import { Op } from 'sequelize';
import Contact from '../models/Contact';

export class ContactRepository {
  async findByEmailOrPhone(email: string | null, phoneNumber: string | null) {
    if (!email && !phoneNumber) {
      return [];
    }
    const where: any = {};
    if (email) where.email = email;
    if (phoneNumber) where.phoneNumber = phoneNumber;
    return Contact.findAll({
      where: { [Op.or]: where },
    });
  }

  async findById(id: number) {
    return Contact.findByPk(id);
  }

  async findGroup(primaryId: number) {
    return Contact.findAll({
      where: {
        [Op.or]: [{ id: primaryId }, { linkedId: primaryId }],
      },
    });
  }

  async createContact(
    email: string | null,
    phoneNumber: string | null,
    linkPrecedence: 'primary' | 'secondary',
    linkedId: number | null
  ) {
    return Contact.create({
      email,
      phoneNumber,
      linkPrecedence,
      linkedId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateContact(contact: Contact, updates: Partial<Contact>) {
    return contact.update(updates);
  }

  async updateLinkedId(oldLinkedId: number, newLinkedId: number) {
    return Contact.update(
      { linkedId: newLinkedId },
      { where: { linkedId: oldLinkedId } }
    );
  }
}