import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { ChapterCarousel } from '../components/reader/ChapterCarousel'
import type { Chapter, Section } from '../domain/types'

function makeChapters(n: number): Chapter[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i + 1}`,
    storyId: 's1',
    sectionId: null,
    position: i + 1,
    name: `Chapter ${i + 1}`,
    headline: `Headline ${i + 1}`,
    body: `Body ${i + 1}`,
    tags: ['bar'],
    imageUrl: null,
    placeName: `Place ${i + 1}`,
    longitude: -0.1 + i * 0.01,
    latitude: 51.5,
    placeId: null,
    camera: null,
    createdAt: 't',
    updatedAt: 't',
  }))
}

const sections: Section[] = []

function Harness({ chapters }: { chapters: Chapter[] }) {
  const [index, setIndex] = useState(0)
  return (
    <div style={{ height: 600 }}>
      <ChapterCarousel chapters={chapters} sections={sections} activeIndex={index} onIndexChange={setIndex} />
    </div>
  )
}

describe('ChapterCarousel', () => {
  it('renders all chapters and shows position', () => {
    render(<Harness chapters={makeChapters(3)} />)
    expect(screen.getAllByTestId('chapter-slide')).toHaveLength(3)
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('1 / 3')
  })

  it('advances and goes back via accessible next/prev controls', () => {
    render(<Harness chapters={makeChapters(3)} />)
    fireEvent.click(screen.getByLabelText('Next chapter'))
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('2 / 3')
    fireEvent.click(screen.getByLabelText('Next chapter'))
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('3 / 3')
    fireEvent.click(screen.getByLabelText('Previous chapter'))
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('2 / 3')
  })

  it('navigates with the keyboard (← / →)', () => {
    render(<Harness chapters={makeChapters(3)} />)
    const root = screen.getByTestId('chapter-carousel')
    fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('2 / 3')
    fireEvent.keyDown(root, { key: 'ArrowLeft' })
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('1 / 3')
  })

  it('does not advance past the ends (controls disable)', () => {
    render(<Harness chapters={makeChapters(2)} />)
    expect(screen.getByLabelText('Previous chapter')).toBeDisabled()
    fireEvent.click(screen.getByLabelText('Next chapter'))
    expect(screen.getByTestId('carousel-position')).toHaveTextContent('2 / 2')
    expect(screen.getByLabelText('Next chapter')).toBeDisabled()
  })

  it('preserves published chapter order', () => {
    render(<Harness chapters={makeChapters(20)} />)
    const slides = screen.getAllByTestId('chapter-slide')
    expect(slides[0]).toHaveTextContent('Headline 1')
    expect(slides[19]).toHaveTextContent('Headline 20')
  })
})
