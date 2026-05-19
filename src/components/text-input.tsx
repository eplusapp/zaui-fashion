import Button from "./button";
import { MinusIcon, PlusIcon } from "./vectors";

export interface TextInputProps {
  title: string;
  placeHolder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput(props: TextInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {props.title && <div className="text-base font-medium text-gray-700">
        <span className="text-danger">*</span>{props.title}
      </div>}
     
      <input
        className="px-2 text-base border-2 border-gray-100 focus:border-gray-500 rounded outline-none py-2"
        value={props.value}
        type="text"
        inputMode="text"
        placeholder={props.placeHolder}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
    </div>
  );
}
