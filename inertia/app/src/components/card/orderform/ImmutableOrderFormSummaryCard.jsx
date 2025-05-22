import { useSelector } from "react-redux";
import ImmutableOrderSummaryCard from "./ImmutableOrderSummaryCard";

const ImmutableOrderFormSummaryCard = () => {
  const orderForm = useSelector((state) => state.orderForm);

  // Prepare props for the dumb component
  const bandName = orderForm["bandName"];
  const albumTitle = orderForm["albumTitle"];
  const catalogNumber = orderForm["catalogNumber"];
  const albumType = orderForm["albumType"]?.label || "";
  const weight = orderForm["weight"]?.label || "";
  const totalQuantity = orderForm["totalQuantity"];
  const testPresses = orderForm["testPresses"];
  const colors = orderForm["colors"]?.map(
    (color) => `${color.quantity} ${color.color.label}`
  ).join(", ");
  const centerLabel = orderForm["centerLabel"]?.label || "";
  const outerPackaging = orderForm["outerPackaging"]?.label || "";
  const insertOptions = orderForm["insertOptions"]?.label || "";
  const polybag = orderForm["polybag"]?.label || "";
  const assemblyOption = orderForm["assemblyOption"]?.label || "";

  return (
    <ImmutableOrderSummaryCard
      bandName={bandName}
      albumTitle={albumTitle}
      catalogNumber={catalogNumber}
      albumType={albumType}
      weight={weight}
      totalQuantity={totalQuantity}
      testPresses={testPresses}
      colors={colors}
      centerLabel={centerLabel}
      outerPackaging={outerPackaging}
      insertOptions={insertOptions}
      polybag={polybag}
      assemblyOption={assemblyOption}
    />
  );
};

export default ImmutableOrderFormSummaryCard;