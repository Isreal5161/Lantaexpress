export const getSellerApprovalStatus = (seller) => {
  if (!seller || seller.role !== "seller") {
    return null;
  }

  return seller.sellerApprovalStatus || "approved";
};

export const isSellerApproved = (seller) => getSellerApprovalStatus(seller) === "approved";

export const getSellerApprovalLabel = (seller) => {
  const status = getSellerApprovalStatus(seller);

  if (status === "pending") return "Pending Approval";
  if (status === "rejected") return "Not Approved";
  if (status === "approved") return "Approved";
  return "";
};

export const getSellerApprovalMessage = (seller) => {
  const status = getSellerApprovalStatus(seller);

  if (status === "pending") {
    return "Your seller account is waiting for admin approval. You can view your dashboard, but seller actions are locked until approval.";
  }

  if (status === "rejected") {
    return "Your seller account has not been approved by admin yet. Seller actions are disabled until this request is approved.";
  }

  return "Your seller account is approved.";
};