import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { GameHistory, Card } from './types';

export async function saveGameHistory(
  userId: string,
  betAmount: number,
  playerHand: Card[],
  dealerHand: Card[],
  result: 'win' | 'loss' | 'push' | 'blackjack',
  chipsWon: number
): Promise<void> {
  if (!db) {
    console.error('Firestore not initialized');
    return;
  }

  try {
    await addDoc(collection(db, 'gameHistory'), {
      userId,
      betAmount,
      playerHand,
      dealerHand,
      result,
      chipsWon,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error saving game history:', error);
  }
}

export async function getGameHistory(userId: string, limitCount: number = 10): Promise<GameHistory[]> {
  if (!db) {
    console.error('Firestore not initialized');
    return [];
  }

  try {
    const q = query(
      collection(db, 'gameHistory'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate(),
    })) as GameHistory[];
  } catch (error) {
    console.error('Error fetching game history:', error);
    return [];
  }
}
