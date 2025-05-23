'use client'
import { useState } from 'react'
import { sortByDate } from '../src/lib/utils';
import { Button } from '../src/components/ui/button'
import { Calendar } from "../src/components/ui/calendar"
import type { TimeUnit } from '../src/components/calendar-timeline'
import { addDays, addMonths, format, isAfter, isBefore } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/ui/popover"

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
} from "../src/components/ui/dropdown-menu"
import {
    useTimeline,
    TimelineContent,
    TimelineControl,
    TimelineHeader,
    TimelineProvider,
    TimelineRows
} from '../src/components/calendar-timeline';

const samples = [
    {
        "id": 1,
        "name": "Alpha Matrix",
        "createdAt": new Date("2025-04-12T11:30:53.944Z"),
        "startDate": new Date("2025-05-05T11:30:53.944Z"),
        "endDate": new Date("2025-05-17T11:30:53.944Z")
    },
    {
        "id": 2,
        "name": "Nova Vortex",
        "createdAt": new Date("2025-04-22T11:30:53.944Z"),
        "startDate": new Date("2025-05-16T11:30:53.944Z"),
        "endDate": new Date("2025-08-02T11:30:53.944Z")
    },
    {
        "id": 3,
        "name": "Gamma Launch",
        "createdAt": new Date("2025-04-15T11:30:53.944Z"),
        "startDate": new Date("2025-04-19T11:30:53.944Z"),
        "endDate": new Date("2025-07-05T11:30:53.944Z")
    },
    {
        "id": 4,
        "name": "Nova Vortex",
        "createdAt": new Date("2025-05-06T11:30:53.944Z"),
        "startDate": new Date("2025-06-02T11:30:53.944Z"),
        "endDate": new Date("2025-07-17T11:30:53.944Z")
    },
    {
        "id": 5,
        "name": "Nova Matrix",
        "createdAt": new Date("2025-04-06T11:30:53.944Z"),
        "startDate": new Date("2025-05-21T11:30:53.944Z"),
        "endDate": new Date("2025-07-30T11:30:53.944Z")
    },
    {
        "id": 6,
        "name": "Gamma Genesis",
        "createdAt": new Date("2025-04-05T11:30:53.944Z"),
        "startDate": new Date("2025-05-04T11:30:53.944Z"),
        "endDate": new Date("2025-05-14T11:30:53.944Z")
    },
    {
        "id": 7,
        "name": "Alpha Horizon",
        "createdAt": new Date("2025-05-13T11:30:53.944Z"),
        "startDate": new Date("2025-05-25T11:30:53.944Z"),
        "endDate": new Date("2025-06-17T11:30:53.944Z")
    },
    {
        "id": 8,
        "name": "Gamma Vortex",
        "createdAt": new Date("2025-03-28T11:30:53.944Z"),
        "startDate": new Date("2025-04-29T11:30:53.944Z"),
        "endDate": new Date("2025-05-30T11:30:53.944Z")
    },
    {
        "id": 9,
        "name": "Nova Genesis",
        "createdAt": new Date("2025-05-01T11:30:53.944Z"),
        "startDate": new Date("2025-05-16T11:30:53.944Z"),
        "endDate": new Date("2025-07-20T11:30:53.944Z")
    },
    {
        "id": 10,
        "name": "Orion Genesis",
        "createdAt": new Date("2025-04-14T11:30:53.944Z"),
        "startDate": new Date("2025-05-28T11:30:53.944Z"),
        "endDate": new Date("2025-06-25T11:30:53.944Z")
    },
    {
        "id": 11,
        "name": "Gamma Horizon",
        "createdAt": new Date("2025-04-21T11:30:53.944Z"),
        "startDate": new Date("2025-05-11T11:30:53.944Z"),
        "endDate": new Date("2025-06-28T11:30:53.944Z")
    },
    {
        "id": 12,
        "name": "Delta Matrix",
        "createdAt": new Date("2025-05-12T11:30:53.944Z"),
        "startDate": new Date("2025-07-08T11:30:53.944Z"),
        "endDate": new Date("2025-09-02T11:30:53.944Z")
    },
    {
        "id": 13,
        "name": "Beta Launch",
        "createdAt": new Date("2025-04-25T11:30:53.944Z")
    },
    {
        "id": 14,
        "name": "Phoenix Vortex",
        "createdAt": new Date("2025-05-18T11:30:53.944Z"),
        "startDate": new Date("2025-07-13T11:30:53.944Z"),
        "endDate": new Date("2025-08-02T11:30:53.944Z")
    },
    {
        "id": 15,
        "name": "Phoenix Genesis",
        "createdAt": new Date("2025-04-01T11:30:53.944Z"),
        "startDate": new Date("2025-04-26T11:30:53.944Z"),
        "endDate": new Date("2025-06-09T11:30:53.944Z")
    },
    {
        "id": 16,
        "name": "Gamma Pulse",
        "createdAt": new Date("2025-04-26T11:30:53.944Z"),
        "startDate": new Date("2025-05-01T11:30:53.944Z"),
        "endDate": new Date("2025-06-03T11:30:53.944Z")
    },
    {
        "id": 17,
        "name": "Alpha Launch",
        "createdAt": new Date("2025-05-02T11:30:53.944Z"),
        "startDate": new Date("2025-05-17T11:30:53.944Z"),
        "endDate": new Date("2025-07-07T11:30:53.944Z")
    },
    {
        "id": 18,
        "name": "Gamma Launch",
        "createdAt": new Date("2025-05-21T11:30:53.944Z"),
        "startDate": new Date("2025-07-14T11:30:53.944Z"),
        "endDate": new Date("2025-10-19T11:30:53.944Z")
    },
    {
        "id": 19,
        "name": "Delta Horizon",
        "createdAt": new Date("2025-03-30T11:30:53.944Z"),
        "startDate": new Date("2025-04-10T11:30:53.944Z"),
        "endDate": new Date("2025-04-27T11:30:53.944Z")
    },
    {
        "id": 20,
        "name": "Phoenix Pulse",
        "createdAt": new Date("2025-04-07T11:30:53.944Z"),
        "startDate": new Date("2025-05-19T11:30:53.944Z"),
        "endDate": new Date("2025-07-05T11:30:53.944Z")
    }
]

const unitMap = {
    day: 'daily',
    week: 'weekly',
    month: 'monthly',
    quarter: 'quarterly'
} as const;

export function App() {
    const [focus, setFocus] = useState(false);
    const [data, setData] = useState(samples);
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

    return (
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
                        variant="outline"
                        onClick={timeline.scrollToday}
                        className='text-xs rounded-sm h-8'
                    >
                        Today
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
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
                                variant="outline"
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
                                variant="outline"
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
                                variant="outline"
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
    )
}
