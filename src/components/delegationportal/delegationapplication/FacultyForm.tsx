'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FacultyAdvisor } from '@/app/types/types'
import { useAuthStore } from '@/app/store/authStore'

export default function FacultyForm() {
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [facultyAdvisor, setFacultyAdvisor] = useState<(FacultyAdvisor & { id: string }) | null>(
    null,
  )
  const [open, setOpen] = useState(false)
  const { user, setUser } = useAuthStore()

  const [formData, setFormData] = useState<FacultyAdvisor>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (!user) {
      setFetching(false)
      return
    }

    const fetchFacultyAdvisor = async () => {
      try {
        const res = await fetch('/api/faculty-advisors')

        if (res.status === 401) {
          setUser(null)
          return
        }

        const data = await res.json()

        console.log('Fetched faculty advisor:', data) // Debug log

        // ✅ Match the API response structure
        if (data.facultyAdvisor) {
          setFacultyAdvisor(data.facultyAdvisor)
          setFormData({
            firstName: data.facultyAdvisor.firstName,
            lastName: data.facultyAdvisor.lastName,
            email: data.facultyAdvisor.email,
            phoneNumber: data.facultyAdvisor.phoneNumber,
          })
        } else {
          setFacultyAdvisor(null)
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
          })
        }
      } catch (error) {
        console.error('Failed to fetch faculty advisor', error)
      } finally {
        setFetching(false)
      }
    }

    fetchFacultyAdvisor()
  }, [user, setUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      // Check if facultyAdvisor exists AND has an id
      const method = facultyAdvisor?.id ? 'PATCH' : 'POST'
      const url = facultyAdvisor?.id
        ? `/api/faculty-advisors/${facultyAdvisor.id}`
        : '/api/faculty-advisors'

      console.log('Saving faculty advisor:', { method, url, formData }) // Debug log

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 401) {
        setUser(null)
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save faculty advisor')
      }

      console.log('Saved faculty advisor:', data) // Debug log

      // Update state with the response (which includes the id)
      setFacultyAdvisor(data)
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
      setOpen(false)
      alert('Faculty advisor saved successfully')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error saving faculty advisor:', err)
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <Button variant="secondary" disabled>
        Loading...
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{'Add Faculty Advisor'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{facultyAdvisor ? 'Edit' : 'Add'} Faculty Advisor</DialogTitle>
            <DialogDescription>
              {facultyAdvisor
                ? "Make changes to your faculty advisor's information here."
                : "Add your faculty advisor's information here."}{' '}
              Click save when you{"'"}re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Faculty Advisor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
