'use client'
import React, { useState } from 'react'
import { RiBookOpenLine, RiTimeLine, RiArrowRightLine } from 'react-icons/ri'
import type { ContentBlock, Exercise, Media, Section } from '@/payload-types'
import BlockCard from '@/components/academy/learn/BlockCard'
import ExercisePanel from '@/components/academy/learn/ExercisePanel'

type ContentBlockWithMedia = ContentBlock & {
  media?: number | Media | null
}

type SectionWithRelations = Section & {
  contentBlocks?: Array<number | ContentBlockWithMedia> | null
  exercise?: number | Exercise | null
}

function isContentBlockObject(
  block: number | ContentBlockWithMedia | null | undefined,
): block is ContentBlockWithMedia {
  return typeof block === 'object' && block !== null
}

function isExerciseObject(exercise: number | Exercise | null | undefined): exercise is Exercise {
  return typeof exercise === 'object' && exercise !== null
}

function canViewBlock(block: ContentBlockWithMedia, studentAgeGroup?: string) {
  if (!block.visibleForAgeGroups || block.visibleForAgeGroups.length === 0) return true
  if (!studentAgeGroup) return true
  return block.visibleForAgeGroups.includes(studentAgeGroup)
}

const SECTION_COLORS = [
  {
    dot: 'bg-[#85c226]',
    badge: 'bg-[#85c226] text-black',
    border: 'border-[#85c226]',
    accent: 'bg-[#85c226]',
  },
  {
    dot: 'bg-[#104179]',
    badge: 'bg-[#104179] text-white',
    border: 'border-[#104179]',
    accent: 'bg-[#104179]',
  },
  { dot: 'bg-black', badge: 'bg-black text-white', border: 'border-black', accent: 'bg-black' },
]

export default function LessonReader({
  sections,
  studentAgeGroup,
}: {
  sections: SectionWithRelations[]
  studentAgeGroup?: string
}) {
  const [activeSection, setActiveSection] = useState<number | null>(null)

  if (!sections.length) {
    return (
      <div
        className="rounded-3xl border-2 border-black bg-white p-10 text-center"
        style={{ boxShadow: '6px 6px 0px #104179' }}
      >
        <div
          className="w-16 h-16 rounded-2xl bg-[#104179] border-2 border-black flex items-center justify-center mx-auto mb-4"
          style={{ boxShadow: '3px 3px 0px #85c226' }}
        >
          <RiBookOpenLine className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black text-black mb-2">No lessons yet!</h2>
        <p className="text-sm text-gray-500 font-semibold">
          Sections and reading blocks will appear here when published.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-5">
        {/* Section Nav Pills */}
        <div className="flex flex-wrap gap-2 pb-1">
          {sections.map((section, idx) => {
            const color = SECTION_COLORS[idx % SECTION_COLORS.length]
            const isActive = activeSection === idx
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(isActive ? null : idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all ${
                  isActive ? color.badge : 'bg-white text-black hover:bg-gray-50'
                }`}
                style={{ boxShadow: isActive ? '2px 2px 0px #000' : '2px 2px 0px #000' }}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : color.dot}`} />
                {idx + 1}. {section.title}
              </button>
            )
          })}
        </div>

        {sections.map((section, idx) => {
          const color = SECTION_COLORS[idx % SECTION_COLORS.length]
          const blocks = (section.contentBlocks || [])
            .filter(isContentBlockObject)
            .filter((b) => canViewBlock(b, studentAgeGroup))
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))

          const exercise = isExerciseObject(section.exercise) ? section.exercise : null

          const isExpanded = activeSection === null || activeSection === idx

          return (
            <section
              key={section.id}
              className="rounded-3xl border-2 border-black bg-white overflow-hidden"
              style={{
                boxShadow: `6px 6px 0px ${idx % 3 === 0 ? '#85c226' : idx % 3 === 1 ? '#104179' : '#000'}`,
                display: isExpanded ? 'block' : 'none',
                animation: 'popIn 0.3s ease both',
              }}
            >
              {/* Section Header */}
              <div
                className={`${color.accent} border-b-2 border-black px-6 py-4 flex flex-wrap items-center gap-3`}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border-2 border-black font-black text-black text-sm shrink-0"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">
                  <h2
                    className={`text-lg sm:text-xl font-black leading-tight ${idx === 0 ? 'text-black' : 'text-white'}`}
                  >
                    {section.title}
                  </h2>
                </div>

                {section.estimatedDuration && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-black text-black text-xs font-black"
                    style={{ boxShadow: '2px 2px 0px #000' }}
                  >
                    <RiTimeLine className="w-3.5 h-3.5" />
                    {section.estimatedDuration}
                  </span>
                )}
              </div>

              {/* Section Body */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  <RiBookOpenLine className="w-3.5 h-3.5" />
                  <span>Section {idx + 1}</span>

                  {exercise && (
                    <>
                      <RiArrowRightLine className="w-3 h-3" />
                      <span className="text-[#85c226]">1 exercise</span>
                    </>
                  )}
                </div>

                {/* Content Blocks */}
                {blocks.length > 0 ? (
                  <div className="space-y-4">
                    {blocks.map((block, bIdx) => (
                      <BlockCard key={block.id} block={block} index={bIdx} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
                    <p className="text-sm font-semibold text-gray-400">No content blocks yet.</p>
                  </div>
                )}

                {/* Exercise Panel */}
                {exercise && <ExercisePanel exercise={exercise} />}
              </div>
            </section>
          )
        })}

        {/* All sections hidden hint */}
        {activeSection !== null && (
          <button
            onClick={() => setActiveSection(null)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-black text-sm font-black text-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RiBookOpenLine className="w-4 h-4" />
            Show all sections
          </button>
        )}
      </div>
    </>
  )
}
