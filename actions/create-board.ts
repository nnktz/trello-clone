'use server';

import * as z from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

export type State = {
  errors?: {
    title?: string[];
  };
  message: string;
};

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: 'Minimum length of 3 letters is required',
  }),
});

export async function create(prevState: State, formData: FormData) {
  const validateFields = CreateBoard.safeParse({
    title: formData.get('title'),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Missing required fields',
    };
  }

  const { title } = validateFields.data;

  try {
    await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      message: 'Database Error',
    };
  }

  revalidatePath('/organization/org_2Y9wKyL6CCDJR2okhQX7wKRnghD');
  redirect('/organization/org_2Y9wKyL6CCDJR2okhQX7wKRnghD');
}
