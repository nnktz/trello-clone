'use client';

import { useEffect, useState } from 'react';

import { ListWithCards } from '@/types';

import { ListForm } from './list-form';
import { ListItem } from './list-item';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className='flex gap-x-3 h-full'>
      {orderedData.map((list, index) => {
        return (
          <ListItem
            data={list}
            key={list.id}
            index={index}
          />
        );
      })}
      <ListForm />
      <div className='flex-shrink-0 w-1'></div>
    </ol>
  );
};
