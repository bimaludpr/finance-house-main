import TestimonialForm from "src/components/Testimonials/TestimonialForm";

interface EditProps {
  id: string;
}

export default function EditTestimonial({ id }: EditProps) {
  return <TestimonialForm mode="edit" id={id} />;
}
