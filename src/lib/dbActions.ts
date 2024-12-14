'use server';

import {
  Stuff,
  Condition,
  Profile,
  StudySession,
} from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: {
  name: string;
  quantity: number;
  owner: string;
  condition: string;
}) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: {
  email: string;
  password: string;
}) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 *Bans user
 * @param userId user to be banned
 */
export async function banUser(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { banned: true },
  });
}

/**
 * Gets feedback so that use client don't bug out crazy style
 */
export async function getFeedback() {
  const feedback = await prisma.feedback.findMany();
  return feedback;
}

/**
 * Updates feedback to be resolved in the database.
 * @param id, the id of the feedback to update.
 */
export async function resolveTrue(id: number) {
  await prisma.feedback.update({
    where: { id },
    data: {
      isResolved: true,
    },
  });
}
/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: {
  email: string;
  password: string;
}) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

export async function createProfile(profile: Profile) {
  // Check if a profile with the given userId exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId: profile.userId },
  });

  if (existingProfile) {
    // If profile exists, update it
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        profilePictureUrl: profile.profilePictureUrl,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        bio: profile.bio,
      },
    });
  } else {
    // If profile does not exist, create a new one
    await prisma.profile.create({
      data: {
        profilePictureUrl: profile.profilePictureUrl,
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        major: profile.major,
        bio: profile.bio,
      },
    });
  }

  return redirect('/profile');
}

export async function createSession(studySession: StudySession) {
  // Check if a profile with the given userId exists

  // If session does not exist, create a new one
  await prisma.studySession.create({
    data: {
      userId: studySession.userId,
      title: studySession.title,
      description: studySession.description,
      course: studySession.course,
      location: studySession.location,
      added: studySession.added,
      sessionDate: studySession.sessionDate,
      startTime: studySession.startTime,
      endTime: studySession.endTime,

      user: {
        connect: { id: studySession.userId },
      },
    },
  });

  return redirect('/mysessions');
}

export async function updateSession(
  studySessionId: number,
  studySession: Partial<StudySession> & { disconnect?: boolean },
) {
  await prisma.studySession.update({
    where: { id: studySessionId },
    data: {
      title: studySession.title,
      description: studySession.description,
      course: studySession.course,
      location: studySession.location,
      sessionDate: studySession.sessionDate,
      startTime: studySession.startTime,
      endTime: studySession.endTime,
      added: studySession.added,
      user: studySession.disconnect
        ? {
          disconnect: { id: studySession.userId },
        }
        : {
          connect: { id: studySession.userId },
        },
    },
  });

  return redirect('/sessions');
}

export async function getSessionById(id: number) {
  return prisma.studySession.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
}

export async function deleteSession(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.studySession.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/sessions');
}

export async function getProfile(userId: number | string) {
  const parsedUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parsedUserId,
      },
      select: {
        firstName: true,
        lastName: true,
        major: true,
        bio: true,
        userId: true,
        profilePictureUrl: true,
      },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export const checkIfEmailExists = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};
