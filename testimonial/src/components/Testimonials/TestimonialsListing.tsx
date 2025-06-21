import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useState } from "react";

const TextInput = dynamic(() => import("home/TextInput"), {
  ssr: false,
}) as FC<any>;
const CommonButton = dynamic(() => import("home/Button"), {
  ssr: false,
}) as FC<any>;
const DatePicker = dynamic(() => import("home/DatePicker"), {
  ssr: false,
}) as FC<any>;
// const CommonModal = dynamic(() => import("home/Modal"), { ssr: false }) as FC<any>;
const FilterLayout = dynamic(() => import("home/filterBox"), {
  ssr: false,
}) as FC<any>;
const Actions = dynamic(() => import("home/Actions"), {
  ssr: false,
}) as FC<any>;
const Table = dynamic(() => import("home/Table"), { ssr: false }) as FC<any>;
const CommonModal = dynamic(() => import("home/CommonModal"), {
  ssr: false,
}) as FC<any>;

const TestimonialsListing = () => {
  const router = useRouter();

  const [content, setContent] = useState<any>("");
  const [selectedFruits, setSelectedFruits] = useState<any[]>([]);
  const [selected, setSelected] = useState("option1");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(["reading"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const itemsPerPage = 5;
  const totalItems = 42;
  const [entriesCount, setEntriesCount] = useState<number>(10);
  const [filterData, setFilterData] = useState({
    page: 1,
    sortColumn: "name",
    sortValue: 1,
  });
  const [pageData, setPageData] = useState({ pages: 2, status: "Loaded" });
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSave = () => {
    alert("Changes saved!");
    setShow(false);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleCommit = (value: number) => {
    console.log("User committed:", value);
  };

  const handleImageUpload = async (blobInfo: any): Promise<string> => {
    const file = blobInfo.blob();
    const tempUrl = URL.createObjectURL(file);
    return tempUrl;

    // For real uploads:
    // const formData = new FormData();
    // formData.append("file", file, blobInfo.filename());
    // const res = await fetch("/api/upload", { method: "POST", body: formData });
    // const data = await res.json();
    // return data.imageUrl;
  };

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
    // fetch new data if needed
  };

  const handleUpload = (files: File[], isInvalid: boolean, error?: string) => {
    if (isInvalid) {
      alert(error);
    } else {
      console.log("Files uploaded:", files);
    }
  };

  const filterHandler = (key: string, value: any) => {
    setFilterData((prev) => ({
      ...prev,
      [key === "sort" ? "sortColumn" : key]: value.key ?? value,
      sortValue: value.value ?? prev.sortValue,
    }));
  };

  const data = [
    {
      customer: "John Doe",
      product: "Product A",
      published: "Yes",
      actions: (
        <Actions
          buttons={{
            edit: "/assets/actions/Edit.svg",
            delete: "/assets/actions/delete.svg",
          }}
          options={{ delete: { size: 25 }, edit: { size: 20 } }}
          visibility={{ delete: true }}
          onDelete={() => handleOpen()}
          onEdit={() => router.push(`/popup/edit/${123}`)}
        />
      ),
    },
    {
      customer: "John Doe",
      product: "Product B",
      published: "No",
      actions: (
        <Actions
          buttons={{
            edit: "/assets/actions/Edit.svg",
            delete: "/assets/actions/delete.svg",
          }}
          options={{ delete: { size: 25 }, edit: { size: 20 } }}
          visibility={{ delete: true }}
          onDelete={() => handleOpen()}
          onEdit={() => router.push(`/popup/edit/${123}`)}
        />
      ),
    },
    {
      customer: "John Doe",
      product: "Product A",
      published: "No",
      actions: (
        <Actions
          className={""}
          css={""}
          rootPath={""}
          // tooltip={{}}
          key={""}
          buttons={{
            edit: "/assets/actions/Edit.svg",
            delete: "/assets/actions/delete.svg",
          }}
          options={{ delete: { size: 25 }, edit: { size: 20 } }}
          visibility={{ delete: true }}
          onDelete={() => handleOpen()}
          onEdit={() => router.push(`/popup/edit/${123}`)}
        />
      ),
    },
  ];

  const columns = [
    {
      title: "Customer",
      key: "customer",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Product",
      key: "product",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Published",
      key: "published",
      h_align: "center",
      d_align: "center",
      sort: true,
    },
    {
      title: "Actions",
      key: "actions",
      h_align: "center",
      d_align: "center",
    },
  ];

  return (
    <div className="mt-3">
      <Table
        entriesCount={entriesCount}
        setEntriesCount={setEntriesCount}
        titles={columns}
        content={data}
        sortValue={{ key: "name", value: 1 }}
        onSort={(e: any) => filterHandler("sort", e)}
        page={filterData.page}
        pagesCount={pageData?.pages || 0}
        pageStatus={pageData?.status}
        onPageChange={(e: any) => filterHandler("page", e)}
        scroll_Max_Rows={5}
      />
      <CommonModal
        show={show}
        size="lg"
        onClose={handleClose}
        onSave={handleSave}
        title="Delete Testimonial"
        body={<p>Are you sure to delete this testimonial ?</p>}
        closeText="Cancel"
      />
    </div>
  );
};

export default TestimonialsListing;
