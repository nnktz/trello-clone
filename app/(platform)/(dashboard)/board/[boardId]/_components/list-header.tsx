'use client';

import { List } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useEventListener } from 'usehooks-ts';

import { updateList } from '@/actions/update-list';
import { useAction } from '@/hooks/use-action';

import { FormInput } from '@/components/form/form-input';

interface ListHeaderProps {
  data: List;
}

export const ListHeader = ({ data }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleSubmit = (formData: FormData) => {
    const newTitle = formData.get('title') as string;
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    if (title === newTitle) {
      return disableEditing();
    }

    execute({ title: newTitle, id, boardId });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className='pt-2 px-2 text-sm font-medium flex justify-between items-start gap-x-2'>
      {isEditing ? (
        <form
          ref={formRef}
          action={handleSubmit}
          className='flex-1 px-[2px]'>
          <input
            type='text'
            name='id'
            id='id'
            hidden
            readOnly
            value={data.id}
          />

          <input
            type='text'
            name='boardId'
            id='boardId'
            hidden
            readOnly
            value={data.boardId}
          />

          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            placeholder='Enter list title...'
            defaultValue={title}
            className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white'
          />

          <button
            type='submit'
            hidden
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent'>
          {title}
        </div>
      )}
    </div>
  );
};
