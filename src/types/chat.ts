
export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  lastMessage?: string;
  lastMessageDate?: string;
  avatar?: string;
};

export type ChatMessageType = {
  id: number;
  senderId: number | string;
  text: string;
  time: string;
};
