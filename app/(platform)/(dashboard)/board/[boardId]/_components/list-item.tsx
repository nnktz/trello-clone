'use client';

import { ListWithCards } from '@/types';

import { ListHeader } from './list-header';

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  return (
    <li className='shrink-0 h-full w-[272px] select-none'>
      <div className='w-full rounded-md bg-[#F1F2F4] shadow-md pb-1'>
        <ListHeader data={data} />
      </div>
    </li>
  );
};
