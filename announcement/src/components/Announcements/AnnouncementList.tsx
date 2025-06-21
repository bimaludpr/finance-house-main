import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  announcement_data,
  announcement_loading,
  announcement_page_details,
} from "src/redux/announcementSlice";
import { AppDispatch } from "src/redux/store";
import {
  deleteAnnouncement,
  getAnnouncementList,
} from "src/services/api-announcement";

const TextInput = dynamic(() => import("home/TextInput"), {
  ssr: false,
}) as FC<any>;
const CommonButton = dynamic(() => import("home/Button"), {
  ssr: false,
}) as FC<any>;
const DatePicker = dynamic(() => import("home/DatePicker"), {
  ssr: false,
}) as FC<any>;
const FilterLayout = dynamic(() => import("home/FilterLayout"), {
  ssr: false,
}) as FC<any>;
const Actions = dynamic(() => import("home/Actions"), {
  ssr: false,
}) as FC<any>;
const Table = dynamic(() => import("home/Table"), { ssr: false }) as FC<any>;
const CommonModal = dynamic(() => import("home/CommonModal"), {
  ssr: false,
}) as FC<any>;
const EntriesCounter = dynamic(() => import("home/EntriesCounter"), {
  ssr: false,
}) as FC<any>;
const SearchInput = dynamic(() => import("home/SearchInput"), {
  ssr: false,
}) as FC<any>;
const EditIcon = dynamic(() => import("home/EditIcon"), { ssr: false });
const DeleteIcon = dynamic(() => import("home/DeleteIcon"), { ssr: false });
const PageHeader = dynamic(() => import("home/PageHeader"), { ssr: false });
const Title = dynamic(() => import("home/Title"), { ssr: false }) as FC<any>;
Title.displayName = "Title";
const Breadcrumb = dynamic(() => import("home/Breadcrumb"), {
  ssr: false,
}) as FC<any>;
Breadcrumb.displayName = "Breadcrumb";

export interface AnnouncementItem {
  title_en: string;
  title_ar: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  id: string;
}

const AnnouncementList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(announcement_loading);
  const announcementData = useSelector(announcement_data) || [];
  const pageDetails = useSelector(announcement_page_details);

  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const initialFilterData = {
    keyword: "",
    sortColumn: "name",
    sortValue: 1,
    page: 0,
    perPage: 10,
  };
  const [filterData, setFilterData] =
    useState<typeof initialFilterData>(initialFilterData);

  useEffect(() => {
    getSearchDataHandler(initialFilterData);
  }, []);

  const filterHandler = (key: string, value: any) => {
    let updatedFilter = { ...filterData };
    switch (key) {
      case "search":
        updatedFilter.page = 0;
        break;

      case "clear":
        updatedFilter = { ...initialFilterData };
        break;

      case "sort":
        updatedFilter.sortColumn = value.key;
        updatedFilter.sortValue = value.value;
        break;

      case "page":
        updatedFilter.page = value;
        break;

      case "perPage":
        updatedFilter.perPage = parseInt(value);
        updatedFilter.page = 0;
        break;

      default:
        (updatedFilter as any)[key] = value;
        updatedFilter.page = 0;
        break;
    }

    setFilterData(updatedFilter);
    getSearchDataHandler(updatedFilter);
  };

  const getSearchDataHandler = (filters: typeof initialFilterData) => {
    let raw = {
      keyword: filters?.keyword,
      sortColumn: filters?.sortColumn,
      sortValue: filters?.sortValue,
      page: filters?.page,
      perPage: filters?.perPage,
    };
    console.log(raw, "raw");
    dispatch(getAnnouncementList(raw));
  };

  const handleOpen = (id: any) => {
    setShow(true);
    setDeleteId(id);
  };
  const handleClose = () => {
    setShow(false);
    setDeleteId("");
  };

  const columns = [
    {
      title: "Sl no",
      key: "sl_no",
      sort: false,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Announcement in English",
      key: "title_en",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Announcement in Arabic",
      key: "title_ar",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Start Date",
      key: "start_date",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "End Date",
      key: "end_date",
      sort: true,
      h_align: "center",
      d_align: "center",
    },
    {
      title: "Active",
      key: "is_active",
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

  const deleteHandler = () => {
    dispatch(
      deleteAnnouncement(deleteId, () => {
        handleClose();
        if (
          announcementData?.length == 1 &&
          pageDetails?.totalPages > 1 &&
          filterData?.page != 0
        ) {
          let value = {
            ...filterData,
            page: filterData?.page - 1,
          };
          setFilterData({
            ...value,
          });
          getSearchDataHandler(value);
        } else {
          getSearchDataHandler(filterData);
        }
      })
    );
  };
  if (loading) return <div>Loading...</div>;
  console.log({ announcementData });
  return (
    <>
      <PageHeader>
        <Title content={`Annoucement`} />
        <Breadcrumb
          content={[
            {
              name: "Home",
              path: "/",
            },
            {
              name: "Annoucement",
            },
          ]}
        />
      </PageHeader>
      <FilterLayout
        // isFilter
        button={
          <CommonButton
            className="mx-2"
            label={"Add Announcement"}
            onClick={() => router.push("/announcement/add")}
            variant="primary"
          />
        }
      />
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginBottom: "40px" }}
      >
        <EntriesCounter
          value={filterData.perPage}
          onChange={(e: any) => filterHandler("perPage", e)}
        />
        <SearchInput
          value={filterData.keyword}
          onChange={(val: string) =>
            setFilterData({
              ...filterData,
              keyword: val,
            })
          }
          onClear={() => filterHandler("clear", null)}
          onKeyDown={(e: { key: string }) => {
            if (e.key === "Enter") {
              filterHandler("search", null);
            }
          }}
        />
      </div>
      <Table
        titles={columns}
        content={
          Array.isArray(announcementData)
            ? announcementData.map((item, i) => ({
                sl_no: filterData.page * filterData.perPage + (i + 1),
                title_en: item?.title_en,
                title_ar: item?.title_ar,
                start_date: item?.start_date,
                end_date: item?.end_date,
                is_active: item?.is_active ? "Yes" : "No",
                actions: (
                  <Actions
                    buttons={{
                      edit: <EditIcon />,
                      delete: <DeleteIcon />,
                    }}
                    options={{ delete: { size: 25 }, edit: { size: 20 } }}
                    visibility={{ delete: true, edit: true }}
                    onDelete={() => handleOpen(item?.id)}
                    onEdit={() => router.push(`/announcement/edit/${item?.id}`)}
                  />
                ),
              }))
            : []
        }
        sortValue={{ key: "name", value: 1 }}
        onSort={(e: any) => filterHandler("sort", e)}
        page={filterData.page}
        pagesCount={pageDetails?.totalPages || 0}
        onPageChange={(e: any) => filterHandler("page", e)}
        scroll_Max_Rows={5}
      />
      <CommonModal
        show={show}
        onClose={handleClose}
        onSave={deleteHandler}
        title="Delete Announcement"
        body={<p>Are you sure to delete this announcement ?</p>}
        closeText="Cancel"
      />
    </>
  );
};

export default AnnouncementList;
