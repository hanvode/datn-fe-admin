export const userColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.img || "http://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "age",
    headerName: "Age",
    width: 100,
  },
  {
    field: "address",
    headerName: "Address",
    width: 300,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 120,
  },
  // {
  //   field: "status",
  //   headerName: "Status",
  //   width: 160,
  //   renderCell: (params) => {
  //     return (
  //       <div className={`cellWithStatus ${params.row.status}`}>
  //         {params.row.status}
  //       </div>
  //     );
  //   },
  // },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "genre",
    headerName: "Genre",
    width: 250,
  },
  {
    field: "title",
    headerName: "Title",
    width: 300,
  },
  {
    field: "address",
    headerName: "Address",
    width: 200,
  },
  {
    field: "city",
    headerName: "District",
    width: 150,
  },
];
export const reviewColumns = [
  { field: "hotelId", headerName: "DinerID", width: 250 },
  {
    field: "username",
    headerName: "Name",
    width: 150,
  },
  {
    field: "content",
    headerName: "Content",
    width: 500,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 80,
  },
  {
    field: "updatedAt",
    headerName: "UpdatedAt",
    width: 230,
  },
  {
    field: "createdAt",
    headerName: "CreatedAt",
    width: 230,
  },
];

export const foodColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.img || "http://i.ibb.co/MBtjqXQ/no-avatar.gif"}
            alt="avatar"
          />
          {params.row.title}
        </div>
      );
    },
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
];
