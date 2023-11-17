'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';
import { createAuditLog } from '@/lib/create-audit-log';
import { InputType, ReturnType } from './types';
import { UpdateList } from './schema';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, id, boardId } = data;

  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: 'Failed to update list',
    };
  }

  revalidatePath(`board/${boardId}`);

  await createAuditLog({
    entityId: list.id,
    entityTitle: list.title,
    entityType: ENTITY_TYPE.LIST,
    action: ACTION.UPDATE,
  });

  return {
    data: list,
  };
};

export const updateList = createSafeAction(UpdateList, handler);
