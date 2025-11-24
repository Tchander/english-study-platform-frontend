export type UiSelectItem = {
  title: string;
  value: string;
};

export type UiSelectProps = {
  items: UiSelectItem[];
  error?: string;
};

export type UiSelectModelValue = string;
