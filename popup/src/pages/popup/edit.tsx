import PopupForm from "src/components/Popup/PopupForm";

interface EditProps {
  id: string;
}

export default function EditPopup({ id }: EditProps) {
  return <PopupForm mode="edit" id={id} />;
}
