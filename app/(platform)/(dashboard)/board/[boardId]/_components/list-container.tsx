'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { toast } from 'sonner';

import { ListWithCards } from '@/types';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';

import { ListForm } from './list-form';
import { ListItem } from './list-item';

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success('List reordered successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success('Card reordered successfully!');
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    if (type === 'card') {
      let newOrderData = [...orderedData];

      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderData);
        executeUpdateCardOrder({ items: reorderedCards, boardId });
      } else {
        // Moving the card to another list
        // Remove the card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderData);
        executeUpdateCardOrder({ items: destList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId='list'
        type='list'
        direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'>
            {orderedData.map((list, index) => {
              return (
                <ListItem
                  data={list}
                  key={list.id}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <ListForm />
            <div className='flex-shrink-0 w-1'></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
