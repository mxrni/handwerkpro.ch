import { faker } from "@faker-js/faker/locale/de_CH";
import {
  AbsenceStatus,
  AbsenceType,
  CalendarEventType,
  CustomerStatus,
  CustomerType,
  DocumentType,
  EmployeeStatus,
  EmploymentType,
  InvoiceStatus,
  OrderStatus,
  Priority,
  QuoteStatus,
  TimeEntryStatus,
} from "../generated/prisma/enums";
import prisma from "./prisma";

// helpers
const pick = <T>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

const chance = (p = 0.5) => Math.random() < p;

const money = (min = 100, max = 5000) =>
  Number(faker.finance.amount({ min, max, dec: 2 }));

const swissPhone = () => faker.phone.number();

async function main() {
  console.log("🌱 Seeding database…");

  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.orderAssignment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.absence.deleteMany();
  await prisma.member.deleteMany();
  await prisma.calendarEvent.deleteMany();

  /* --------------------------- members ------------------------------- */
  const _members = await prisma.member.createMany({
    data: Array.from({ length: 8 }).map((_, i) => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: i === 0 ? "owner" : "member",
      phone: swissPhone(),
      privatphone: chance(0.3) ? swissPhone() : null,
      jobTitle: faker.person.jobTitle(),
      department: faker.commerce.department(),
      employmentType: pick(Object.values(EmploymentType)),
      weeklyHours: pick([40, 42, 80]),
      hourlyRate: faker.number.int({ min: 60, max: 120 }),
      status: EmployeeStatus.ACTIVE,
    })),
    skipDuplicates: true,
  });

  const allMembers = await prisma.member.findMany();

  /* -------------------------------- customers ------------------------------ */
  const _customers = await prisma.customer.createMany({
    data: Array.from({ length: 60 }).map(() => {
      const isBusiness = chance(0.6);
      return {
        type: isBusiness ? CustomerType.BUSINESS : CustomerType.PRIVATE,
        status: pick(Object.values(CustomerStatus)),
        name: isBusiness ? faker.company.name() : faker.person.fullName(),
        contactName: isBusiness ? faker.person.fullName() : null,
        email: chance(0.85) ? faker.internet.email() : null,
        phone: chance(0.7) ? swissPhone() : null,
        mobile: chance(0.4) ? swissPhone() : null,
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode("8###"),
        city: faker.location.city(),
        notes: chance(0.3) ? faker.lorem.sentence() : null,
      };
    }),
  });

  const allCustomers = await prisma.customer.findMany();

  /* ---------------------------- orders & invoices ------------------------- */
  for (const customer of allCustomers) {
    const _orders = await prisma.order.createMany({
      data: Array.from({
        length: faker.number.int({ min: 1, max: 3 }),
      }).map(() => ({
        customerId: customer.id,
        orderNumber: faker.string.alphanumeric(8).toUpperCase(),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        status: pick(Object.values(OrderStatus)),
        priority: pick(Object.values(Priority)),
        estimatedHours: faker.number.int({ min: 10, max: 200 }),
        estimatedCost: money(1000, 10000),
        actualCost: money(800, 12000),
        startDate: faker.date.recent({ days: 30 }),
        deadline: faker.date.soon({ days: 60 }),
      })),
    });

    const createdOrders = await prisma.order.findMany({
      where: { customerId: customer.id },
    });

    for (const order of createdOrders) {
      const assignedMembers = faker.helpers
        .shuffle(allMembers)
        .slice(0, faker.number.int({ min: 1, max: 4 }));

      await prisma.orderAssignment.createMany({
        data: assignedMembers.map((m) => ({
          orderId: order.id,
          memberId: m.id,
          role: chance(0.3) ? "Projektleitung" : "Mitarbeiter",
        })),
      });

      /* -------------------------------- documents ---------------------------- */
      await prisma.document.createMany({
        data: Array.from({
          length: faker.number.int({ min: 1, max: 4 }),
        }).map(() => ({
          orderId: order.id,
          name: faker.system.fileName(),
          type: pick(Object.values(DocumentType)),
          mimeType: "application/pdf",
          size: faker.number.int({ min: 50_000, max: 5_000_000 }),
          url: faker.internet.url(),
        })),
      });

      /* -------------------------------- invoice ------------------------------ */
      const invoiceStatus = pick(Object.values(InvoiceStatus));
      const subtotal = money(500, 5000);
      const taxAmount = Number((subtotal * 0.081).toFixed(2));
      const total = subtotal + taxAmount;

      const invoice = await prisma.invoice.create({
        data: {
          customerId: customer.id,
          orderId: order.id,
          invoiceNumber: faker.string.alphanumeric(8).toUpperCase(),
          title: `Rechnung ${order.title}`,
          status: invoiceStatus,
          issueDate: faker.date.recent(),
          dueDate: faker.date.soon({ days: 30 }),
          subtotal,
          taxRate: 8.1,
          taxAmount,
          total,
          paidAmount: invoiceStatus === InvoiceStatus.PAID ? total : null,
        },
      });

      /* ---------------------------- invoice items ---------------------------- */
      const invoiceItems = Array.from({
        length: faker.number.int({ min: 1, max: 5 }),
      }).map((_, i) => {
        const qty = faker.number.int({ min: 1, max: 10 });
        const price = money(50, 1000);
        return {
          invoiceId: invoice.id,
          position: i + 1,
          description: faker.commerce.productName(),
          unit: pick(["h", "Stk", "m²"]),
          quantity: qty,
          unitPrice: price,
          total: qty * price,
        };
      });

      await prisma.invoiceItem.createMany({ data: invoiceItems });

      /* -------------------------------- payment ------------------------------ */
      if (invoiceStatus === InvoiceStatus.PAID) {
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: total,
            date: faker.date.recent(),
            method: pick(["Überweisung", "Bar", "Karte"]),
            reference: faker.finance.transactionDescription(),
          },
        });
      }
    }
  }

  /* -------------------------------- quotes --------------------------------- */
  for (const customer of allCustomers.slice(0, 25)) {
    const quote = await prisma.quote.create({
      data: {
        customerId: customer.id,
        quoteNumber: faker.string.alphanumeric(7).toUpperCase(),
        title: "Offerte",
        description: faker.lorem.sentence(),
        status: pick(Object.values(QuoteStatus)),
        taxRate: 8.1,
      },
    });

    const items = Array.from({
      length: faker.number.int({ min: 2, max: 6 }),
    }).map((_, i) => {
      const qty = faker.number.int({ min: 1, max: 10 });
      const price = money(80, 400);
      return {
        quoteId: quote.id,
        position: i + 1,
        description: faker.commerce.productName(),
        unit: pick(["h", "Stk", "m²"]),
        quantity: qty,
        unitPrice: price,
        total: qty * price,
      };
    });

    await prisma.quoteItem.createMany({ data: items });
  }

  /* ------------------------------ time entries ------------------------------ */
  for (const member of allMembers) {
    await prisma.timeEntry.createMany({
      data: Array.from({
        length: faker.number.int({ min: 10, max: 30 }),
      }).map(() => {
        const approved = chance(0.6);
        const start = faker.date.recent({ days: 14 });
        const end = new Date(
          start.getTime() +
            faker.number.int({ min: 1, max: 8 }) * 60 * 60 * 1000,
        );
        return {
          memberId: member.id,
          date: start,
          startTime: start,
          endTime: end,
          description: faker.lorem.sentence(),
          status: approved ? TimeEntryStatus.APPROVED : TimeEntryStatus.PENDING,
          approvedById: approved ? pick(allMembers).id : null,
        };
      }),
    });
  }

  /* -------------------------------- absences -------------------------------- */
  await prisma.absence.createMany({
    data: Array.from({ length: 20 }).map(() => {
      const approved = chance(0.7);
      const start = faker.date.soon({ days: 10 });
      const end = new Date(
        start.getTime() +
          faker.number.int({ min: 1, max: 5 }) * 24 * 60 * 60 * 1000,
      );
      return {
        memberId: pick(allMembers).id,
        type: pick(Object.values(AbsenceType)),
        startDate: start,
        endDate: end,
        halfDay: chance(0.2),
        reason: faker.lorem.words(3),
        status: approved ? AbsenceStatus.APPROVED : AbsenceStatus.PENDING,
        approvedById: approved ? pick(allMembers).id : null,
      };
    }),
  });

  /* ---------------------------- calendar events ----------------------------- */
  await prisma.calendarEvent.createMany({
    data: Array.from({ length: 20 }).map(() => ({
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      type: pick(Object.values(CalendarEventType)),
      startTime: faker.date.soon(),
      endTime: faker.date.soon({ days: 1 }),
      allDay: chance(0.2),
    })),
  });

  console.log("✅ Seeding completed successfully");
}

/* -------------------------------------------------------------------------- */

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
