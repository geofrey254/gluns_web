import type { CollectionConfig } from 'payload'

function generateInvoiceNumber() {
  const year = new Date().getFullYear()

  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')

  return `GLUNS-${year}-${random}`
}

export const Registrations: CollectionConfig = {
  slug: 'registrations',

  admin: {
    useAsTitle: 'email',
    group: 'Administration',
    defaultColumns: ['registrationType', 'email', 'schoolName', 'status', 'createdAt'],
  },

  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
    delete: ({ req }) => {
      return !!(req.user && 'roles' in req.user && req.user.roles.includes('admin'))
    },
  },

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.invoiceNumber = generateInvoiceNumber()
        }

        return data
      },

      async ({ data, req }) => {
        const event = await req.payload.findByID({
          collection: 'event',
          id: data.event,
        })

        if (data.registrationType === 'individual') {
          data.totalAmount = event.cost
        }

        if (data.registrationType === 'school') {
          data.totalAmount = (event.cost || 0) * data.numOfStudents
        }

        return data
      },
    ],

    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return

        const event =
          typeof doc.event === 'object'
            ? doc.event
            : await req.payload.findByID({
                collection: 'event',
                id: doc.event,
              })

        await req.payload.sendEmail({
          to: doc.email,

          subject: `Registration Received - ${event.title}`,

          html: `
            <h2>Registration Successful</h2>

            <p>Thank you for registering.</p>

            <p><strong>Invoice Number:</strong> ${doc.invoiceNumber}</p>

            <p><strong>Event:</strong> ${event.title}</p>

            <p><strong>Location:</strong> ${event.location}</p>

            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>

            <p>We will contact you shortly.</p>
          `,
        })

        await req.payload.sendEmail({
          to: process.env.ADMIN_EMAIL,

          subject: `New Registration - ${event.title} by ${doc.email}`,

          html: `
            <h2>New Registration</h2>

            <p>Email: ${doc.email}</p>

            <p>School: ${doc.schoolName}</p>

            <p>Invoice: ${doc.invoiceNumber}</p>
          `,
        })
      },
    ],
  },

  fields: [
    {
      name: 'registrationType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Individual',
          value: 'individual',
        },
        {
          label: 'School',
          value: 'school',
        },
      ],
    },

    {
      name: 'fullName',
      type: 'text',
    },

    {
      name: 'grade',
      type: 'number',
    },

    {
      name: 'schoolName',
      type: 'text',
      required: true,
    },

    {
      name: 'contactPerson',
      type: 'text',
    },

    {
      name: 'numOfStudents',
      type: 'number',
    },

    {
      name: 'email',
      type: 'email',
      required: true,
    },

    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },

    {
      name: 'event',
      type: 'relationship',
      relationTo: 'event',
      required: true,
    },

    {
      name: 'invoiceNumber',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'totalAmount',
      type: 'number',
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',

      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
  ],
}
