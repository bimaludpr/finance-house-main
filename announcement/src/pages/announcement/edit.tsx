import AnnouncementForm from "src/components/Announcements/AnnouncementForm";

interface EditProps {
  id: string;
}

export default function Edit({ id }: EditProps) {
  return <AnnouncementForm mode="edit" id={id} />;
}
