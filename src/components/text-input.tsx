import Button from "./button";
import { MinusIcon, PlusIcon } from "./vectors";

export interface TextInputProps {
  title: string;
  placeHolder?: string;
  value: string;
  isRequired?: Boolean;
  onChange: (value: string) => void;
}

export default function TextInput(props: TextInputProps) {
  const { isRequired  = false} = props 
  return (
    <div className="flex flex-col gap-1 w-full">
      {props.title && <div className="text-base font-medium text-gray-700">
        {props.title}{isRequired ? <span className="text-danger">*</span> : <></>}
      </div>}
     
      <input
        className="h-12 px-2 text-base border-2 border-gray-100 focus:border-gray-500 rounded outline-none py-2"
        value={props.value}
        type="text"
        inputMode="text"
        placeholder={props.placeHolder}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      />
    </div>
  );
}
