'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function deleteBoard(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  });

  revalidatePath('/organization/org_2Y9wKyL6CCDJR2okhQX7wKRnghD');
}
