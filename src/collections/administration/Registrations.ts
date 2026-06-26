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

          subject: `New ${doc.registrationType === 'school' ? 'School' : 'Individual'} Registration - ${event.title}`,

          html: `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width:700px; margin:auto; border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
      <div style="background:#0f172a; color:#fff; padding:20px;">
        <h2 style="margin:0;">New Registration Received</h2>
        <p style="margin:8px 0 0;">
          A new registration has been submitted through the website.
        </p>
      </div>

      <div style="padding:24px;">

        <h3>Registration Details</h3>

        <table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td><strong>Registration Type</strong></td>
            <td>${doc.registrationType}</td>
          </tr>

          <tr>
            <td><strong>Status</strong></td>
            <td>${doc.status}</td>
          </tr>

          <tr>
            <td><strong>Invoice Number</strong></td>
            <td>${doc.invoiceNumber}</td>
          </tr>

          <tr>
            <td><strong>Total Amount</strong></td>
            <td>${doc.totalAmount}</td>
          </tr>

          <tr>
            <td><strong>Submitted On</strong></td>
            <td>${new Date(doc.createdAt).toLocaleString()}</td>
          </tr>
        </table>

        <hr style="margin:24px 0;" />

        <h3>Participant Information</h3>

        <table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td><strong>Full Name</strong></td>
            <td>${doc.fullName || '-'}</td>
          </tr>

          <tr>
            <td><strong>Email</strong></td>
            <td>${doc.email}</td>
          </tr>

          <tr>
            <td><strong>Phone</strong></td>
            <td>${doc.phoneNumber}</td>
          </tr>

          <tr>
            <td><strong>Grade</strong></td>
            <td>${doc.grade || '-'}</td>
          </tr>
        </table>

        <hr style="margin:24px 0;" />

        <h3>School Information</h3>

        <table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td><strong>School</strong></td>
            <td>${doc.schoolName}</td>
          </tr>

          <tr>
            <td><strong>Contact Person</strong></td>
            <td>${doc.contactPerson || '-'}</td>
          </tr>

          <tr>
            <td><strong>Number of Students</strong></td>
            <td>${doc.numOfStudents || '-'}</td>
          </tr>
        </table>

        <hr style="margin:24px 0;" />

        <h3>Event Information</h3>

        <table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse;">
          <tr>
            <td><strong>Event</strong></td>
            <td>${event.title}</td>
          </tr>

          <tr>
            <td><strong>Date</strong></td>
            <td>${new Date(event.date).toLocaleDateString()}</td>
          </tr>

          <tr>
            <td><strong>Location</strong></td>
            <td>${event.location}</td>
          </tr>

          <tr>
            <td><strong>Cost per Student</strong></td>
            <td>${event.cost}</td>
          </tr>
        </table>

      </div>

      <div style="background:#f8f9fa; padding:16px; text-align:center; color:#666;">
        This notification was generated automatically by the registration system.
      </div>
    </div>
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
