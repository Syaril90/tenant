export type HubComposerAction = {
  id: string;
  label: string;
  icon: string;
};

export type HubComposer = {
  prompt: string;
  postLabel: string;
  actions: HubComposerAction[];
};

export type HubFeedAuthor = {
  name: string;
  avatarUrl: string;
  meta: string;
};

export type HubFeedBaseItem = {
  id: string;
  author: HubFeedAuthor;
};

export type HubPostItem = HubFeedBaseItem & {
  type: "post";
  content: string;
  imageUrl?: string;
  likeCount: number;
  commentCount: number;
  replies?: {
    id: string;
    authorName: string;
    content: string;
  }[];
};

export type HubNoticeItem = {
  id: string;
  type: "notice";
  badge: string;
  title: string;
  description: string;
  meta: string;
};

export type HubFeedItem = HubPostItem | HubNoticeItem;

export type HubModel = {
  header: {
    title: string;
  };
  composer: HubComposer;
  feed: HubFeedItem[];
  messages: {
    loading: string;
    errorTitle: string;
    errorDescription: string;
    emptyComposer: string;
  };
};
