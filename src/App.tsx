import calendarTimelineCode from '@/components/calendar-timeline.tsx?raw';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/internal/hero'
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from './components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { generateRandom, sortByDate } from '@/lib/utils';
import { BlockCode, BlockPreview } from './components/internal/block';
import { addDays, addMonths, format, isAfter, isBefore } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ListFilterPlus,
  ArrowDownNarrowWide,
  CalendarIcon,
  FocusIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  type TimeUnit,
  useTimeline,
  TimelineContent,
  TimelineControl,
  TimelineHeader,
  TimelineProvider,
  TimelineRows
} from '@/components/calendar-timeline';
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent as TimelineWrapper,
  TimelineContentLabel,
  TimelineContentDescription
} from "@/components/internal/timeline"

const unitMap = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  quarter: 'quarterly'
} as const;

const installations = [
  {
    label: 'Install the following dependencies',
    description: 'Required scroll-area Shadcn UI components',
    children: (
      <BlockCode
        full
        lang='bash'
        className='mt-4'
        code="npm install react-dnd react-dnd-html5-backend"
      />
    )
  },
  {
    label: 'Copy and paste the following code into your project',
    children: <BlockCode code={calendarTimelineCode} className='mt-4' />
  },
];

const usages = {
  import: `import {
    useTimeline,
    TimelineProvider,
    TimelineControl,
    TimelineContent,
    TimelineHeader,
    TimelineRows
} from '@/components/calendar-timeline';`,
  sample: `function Component() {
  const timeline = useTimeline({
    // configuration here...
  });

  return (
    <TimelineProvider context={timeline}>
      <TimelineControl>
        {/* your action controls */}
      </TimelineControl>
      <TimelineContent className='max-h-[30rem]'>
          <TimelineHeader />
          <TimelineRows />
      </TimelineContent>
  </TimelineProvider>
  )
}`
}

export function App() {
  const [isLoading, setLoading] = useState(false);
  const [exampleCode, setExampleCode] = useState('');

  const [data, setData] = useState(generateRandom(20));
  const [focus, setFocus] = useState(false);
  const [hideRowHeader, setHideRowHeader] = useState(false);

  const [unit, setUnit] = useState<TimeUnit>('week');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [date, setDate] = useState({
    from: addMonths(new Date(), -3),
    to: addMonths(new Date(), 3),
  });

  const timeline = useTimeline({
    unit,
    dateRange: date,
    data: sortByDate(data, 'createdAt', sort),
    field: {
      state: {
        header: 'name',
        startDate: 'startDate',
        endDate: 'endDate'
      },
      header: (item) => (
        <a href="#" className='text-sm font-semibold hover:underline'>
          {item.name}
        </a>
      ),
      cell: (item) => {
        const startDate = item.startDate ? format(item.startDate, "EEE, MMM d ") : '';
        const endDate = item.endDate ? format(item.endDate, "EEE, MMM d") : ''
        return (
          <span className='text-xs truncate font-semibold'>
            {`${startDate} - ${endDate}`}
          </span>
        )
      },
      onClick: ({ item, startDate, endDate }) => {
        alert(`Clicked ${item ? 'timeline' : 'calendar'}, see log for detail.`);
        console.log({ item, startDate, endDate });
      },
      onDrop: ({ item, startDate, endDate }) => {
        setData((prev) => prev.map((value) =>
          value.id === item.id ? { ...item, startDate, endDate } : value
        ))
      }
    },
  });

  useEffect(() => {
    setLoading(true);
    fetch('/example-code.tsx').then(res => res.text()).then((text) => {
      setExampleCode(text.replace(/(\.\.\/src\/)/g, '@/'));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-4xl">
        <Hero className="animate-in fade-in zoom-in duration-500" />
        <div className="mt-12 flex flex-col gap-12">
          {isLoading ? <Skeleton className='w-full h-[30rem]' /> : (
            <BlockPreview
              showPreviewCode
              label='Calendar timeline'
              block={{ code: exampleCode }}
              className='animate-in fade-in duration-500'
              classNames={{ wrapper: 'flex items-center overflow-hidden' }}
            >
              <TimelineProvider
                force={!focus}
                context={timeline}
                hideRowHeader={hideRowHeader}
                className='max-w-4xl'
              >
                <TimelineControl className='justify-between'>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => timeline.navigate('prev')}
                      className='rounded-sm size-8'
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => timeline.navigate('next')}
                      className='rounded-sm size-8'
                    >
                      <ChevronRight />
                    </Button>
                    <Button
                      onClick={timeline.scrollToday}
                      className='text-xs rounded-sm h-8'
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setHideRowHeader(!hideRowHeader)}
                      className="text-xs rounded-sm h-8"
                    >
                      Panel: {hideRowHeader ? 'hide' : 'show'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          className="text-xs rounded-sm h-8"
                        >
                          <ListFilterPlus className="size-4" />
                          Show in {unitMap[timeline.unit]}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {Object.keys(unitMap).map((key, idx) => (
                          <DropdownMenuItem
                            key={idx}
                            onClick={() => setUnit(key as TimeUnit)}
                            className="capitalize text-xs focus:text-primary focus:bg-primary/40"
                          >
                            {key}
                            {key === unit && <CheckIcon className='ml-auto' />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          className="text-xs rounded-sm h-8"
                        >
                          <ArrowDownNarrowWide className="size-5" />
                          Sort {sort}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {['asc', 'desc'].map((key, idx) => (
                          <DropdownMenuItem
                            key={idx}
                            onClick={() => setSort(key as 'asc')}
                            className="capitalize text-xs focus:text-primary focus:bg-primary/40"
                          >
                            {key}
                            {key === sort && <CheckIcon className='ml-auto' />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          className="text-xs rounded-sm h-8"
                        >
                          <CalendarIcon className='size-5' />
                          Date fields
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="flex gap-4">
                          <Calendar
                            initialFocus
                            mode="single"
                            selected={date.from}
                            defaultMonth={date.from}
                            className="border-r pr-4"
                            onSelect={(from) => {
                              if (!from) return
                              setDate((prev) => ({
                                from,
                                to: prev.to && isAfter(from, prev.to) ? addDays(from, 1) : prev.to
                              }))
                            }}
                          />
                          <Calendar
                            initialFocus
                            mode="single"
                            selected={date.to}
                            defaultMonth={date.to}
                            disabled={(value) => isBefore(value, date.from || new Date())}
                            onSelect={(to) => {
                              if (!to) return
                              setDate((prev) => ({ to, from: prev.from || addDays(to, -1) }))
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      size="icon"
                      variant={focus ? "secondary" : "outline"}
                      className="text-xs rounded-sm size-8"
                      onClick={() => setFocus(!focus)}
                    >
                      <FocusIcon className='size-5' />
                    </Button>
                  </div>
                </TimelineControl>

                <TimelineContent className='max-h-[30rem]'>
                  <TimelineHeader />
                  <TimelineRows />
                </TimelineContent>
              </TimelineProvider>
            </BlockPreview>
          )}

          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold leading-none">
              Installation
            </h1>
            <Separator />
            <Timeline>
              {installations.map((item, idx) => (
                <TimelineItem key={idx}>
                  <TimelineConnector>
                    <TimelineDot className='font-semibold'>
                      {idx + 1}
                    </TimelineDot>
                  </TimelineConnector>
                  <TimelineWrapper>
                    <TimelineContentLabel>
                      {item.label}
                    </TimelineContentLabel>
                    {isLoading ? <Skeleton className='w-full h-60 mt-4' /> : item.children}
                    {item.description && (
                      <TimelineContentDescription>
                        {item.description}
                      </TimelineContentDescription>
                    )}
                  </TimelineWrapper>
                </TimelineItem>
              ))}
            </Timeline>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold leading-none">
              Usage
            </h1>
            <Separator />
            <BlockCode full code={usages.import} />
            <BlockCode full code={usages.sample} />
          </div>
        </div>
      </main>
    </div>
  )
}
