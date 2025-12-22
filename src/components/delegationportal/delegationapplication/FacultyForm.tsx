'use client'
import { useState } from 'react'
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

export default function FacultyForm() {
  return (
    <section>
      <div>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="secondary">Add Faculty Advisor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Faculty Advisor</DialogTitle>
                <DialogDescription>
                  Make changes to your faculty advisor{"'"}s information here. Click save when you
                  {"'"}re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input id="firstname" name="firstname" defaultValue="John" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastname">Last Name</Label>
                  <Input id="lastname" name="lastname" defaultValue="Doe" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" defaultValue="johndoe@example.com" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" defaultValue="+254712345678" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </section>
  )
}
