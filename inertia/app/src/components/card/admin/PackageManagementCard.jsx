import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../Card";
import LabeledInput from "../../form/main/LabeledInput";
import {
  createPackageAdmin,
  deletePackageAdmin,
  getAllPackagesAdmin,
  updatePackageAdmin,
} from "../../../modules/heliosApi";
import {
  extractFormConfig,
  getCatalogSubtotalFromPrices,
  getPackageCtaLabel,
  validateAdvertisedPrice,
  validatePackageSlug,
} from "../../../modules/packageDeals";
import { getPrice } from "../../../modules/products";
import { albumTypeOptions } from "../../form/orderform/AlbumType";
import { weightOptions } from "../../form/orderform/Weight";
import { centerLabelOptions } from "../../form/orderform/CenterLabel";
import { innersleeveOptions } from "../../form/orderform/Innersleeve";
import { outerPackagingTypeOptions } from "../../form/orderform/OuterPackagingType";
import { outerPackagingPrintOptions } from "../../form/orderform/OuterPackagingPrint";
import { outerPackagingFinishOptions } from "../../form/orderform/OuterPackagingFinish";
import { insertTypeOptions } from "../../form/orderform/InsertType";
import { insertPrintOptions } from "../../form/orderform/InsertPrint";
import { insertFinishOptions } from "../../form/orderform/InsertFinish";
import { assemblyOptionOptions } from "../../form/orderform/AssemblyOption";
import { PolybagOptions } from "../../form/orderform/Polybag";
import { getAvailableColors } from "../../../modules/colors";
import { minimumQuantity, quantityFactor } from "../../form/orderform/TotalQuantity";
import { minimumTestPresses } from "../../form/orderform/TestPresses";

const ErrorText = styled.p`
  color: #b00020;
`;

const Row = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const PackageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const PackageButton = styled.button`
  text-align: left;
  padding: 0.6rem 0.8rem;
`;

const defaultFormConfig = () => {
  const black = getAvailableColors().find((color) => color.value === "Black") || getAvailableColors()[0];
  return {
    albumType: albumTypeOptions[0],
    weight: weightOptions[0],
    totalQuantity: 500,
    testPresses: minimumTestPresses,
    colors: [{ color: black, quantity: 500 }],
    colorsVerified: true,
    centerLabel: centerLabelOptions[0],
    innersleeve: innersleeveOptions[0],
    outerPackagingType: outerPackagingTypeOptions[0],
    outerPackagingPrint: outerPackagingPrintOptions[1] || outerPackagingPrintOptions[0],
    outerPackagingFinish: outerPackagingFinishOptions[0],
    insertType: insertTypeOptions.find((option) => option.value === "none") || insertTypeOptions[0],
    insertPrint: null,
    insertFinish: null,
    polybag: PolybagOptions[0],
    assemblyOption: assemblyOptionOptions[0],
  };
};

const emptyDraft = () => ({
  name: "",
  slug: "",
  description: "",
  ctaLabel: "",
  advertisedPrice: "",
  isActive: true,
  sortOrder: 0,
  formConfig: defaultFormConfig(),
});

const slugFromName = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const PackageManagementCard = () => {
  const products = useSelector((state) => state.products?.products);
  const variations = useSelector((state) => state.products?.variations);
  const [packages, setPackages] = useState([]);
  const [draft, setDraft] = useState(emptyDraft());
  const [editingId, setEditingId] = useState(null);
  const [errorText, setErrorText] = useState("");

  const catalogSubtotal = useMemo(() => {
    return getCatalogSubtotalFromPrices(draft.formConfig, (name, color) =>
      getPrice(name, draft.formConfig, products, variations, color) || 0
    );
  }, [draft.formConfig, products, variations]);

  const loadPackages = async () => {
    const result = await getAllPackagesAdmin();
    if (result?.status === 200 && Array.isArray(result?.data?.packages)) {
      setPackages(result.data.packages);
    } else {
      setErrorText("Error loading packages");
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const updateFormConfig = (patch) => {
    setDraft((prev) => ({
      ...prev,
      formConfig: { ...prev.formConfig, ...patch, colorsVerified: true },
    }));
  };

  const toPayload = () => ({
    name: draft.name,
    slug: draft.slug,
    description: draft.description,
    ctaLabel: draft.ctaLabel,
    advertisedPrice: Number(draft.advertisedPrice),
    catalogSubtotal,
    isActive: draft.isActive,
    sortOrder: Number(draft.sortOrder) || 0,
    formConfig: extractFormConfig(draft.formConfig),
  });

  const handleSave = async () => {
    const payload = toPayload();
    if (!payload.name.trim()) {
      setErrorText("Name is required");
      return;
    }
    if (!validatePackageSlug(payload.slug)) {
      setErrorText("Slug must be lowercase letters, numbers, and hyphens");
      return;
    }
    const advertisedCheck = validateAdvertisedPrice(payload.advertisedPrice, catalogSubtotal);
    if (!advertisedCheck.valid) {
      setErrorText(advertisedCheck.error);
      return;
    }
    setErrorText("");
    const result = editingId
      ? await updatePackageAdmin(editingId, payload)
      : await createPackageAdmin(payload);
    if (result?.status !== 200 && result?.status !== 201) {
      setErrorText(result?.response?.data?.error || "Error saving package");
      return;
    }
    setDraft(emptyDraft());
    setEditingId(null);
    await loadPackages();
  };

  const handleEdit = (pressingPackage) => {
    setEditingId(pressingPackage.id);
    setDraft({
      name: pressingPackage.name,
      slug: pressingPackage.slug,
      description: pressingPackage.description || "",
      ctaLabel: pressingPackage.ctaLabel || "",
      advertisedPrice: String(pressingPackage.advertisedPrice ?? ""),
      isActive: !!pressingPackage.isActive,
      sortOrder: pressingPackage.sortOrder || 0,
      formConfig: { ...defaultFormConfig(), ...(pressingPackage.formConfig || {}) },
    });
  };

  const handleDelete = async (packageId) => {
    setErrorText("");
    const result = await deletePackageAdmin(packageId);
    if (result?.status !== 204) {
      setErrorText(result?.response?.data?.error || "Error deleting package");
      return;
    }
    if (editingId === packageId) {
      setDraft(emptyDraft());
      setEditingId(null);
    }
    await loadPackages();
  };

  const noneOrSupplied = (value) => value === "none" || value === "customerSupplied";
  const outerType = draft.formConfig.outerPackagingType?.value;
  const insertType = draft.formConfig.insertType?.value;

  return (
    <Card title="Package deals">
      <p>Create advertised pressing-price packages. Shipping stays extra. Locked specs are copied into the customer order form.</p>
      {errorText && <ErrorText>{errorText}</ErrorText>}

      <PackageList>
        {packages.map((pressingPackage) => (
          <PackageButton key={pressingPackage.id} type="button" onClick={() => handleEdit(pressingPackage)}>
            {getPackageCtaLabel(pressingPackage)} {pressingPackage.isActive ? "" : "(inactive)"}
          </PackageButton>
        ))}
      </PackageList>

      <h3>{editingId ? "Edit package" : "New package"}</h3>
      <LabeledInput ignorePackageLock={true} name="packageName" text="Name" type="text" value={draft.name} onChange={(event) => {
        const name = event.target.value;
        setDraft((prev) => ({
          ...prev,
          name,
          slug: prev.slug || slugFromName(name),
        }));
      }} />
      <LabeledInput ignorePackageLock={true} name="packageSlug" text="Slug" type="text" value={draft.slug} onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} />
      <LabeledInput ignorePackageLock={true} name="packageCta" text="CTA label" type="text" value={draft.ctaLabel} onChange={(event) => setDraft((prev) => ({ ...prev, ctaLabel: event.target.value }))} />
      <LabeledInput ignorePackageLock={true} name="packageDescription" text="Description" type="text" value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} />
      <LabeledInput ignorePackageLock={true} name="advertisedPrice" text="Advertised pressing price" type="number" min={1} step={1} value={draft.advertisedPrice} onChange={(event) => setDraft((prev) => ({ ...prev, advertisedPrice: event.target.value }))} />
      <p>Catalog subtotal: ${catalogSubtotal.toFixed(2)} · Implied discount: ${Math.max(0, catalogSubtotal - Number(draft.advertisedPrice || 0)).toFixed(2)}</p>
      <Row>
        <label>
          <input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft((prev) => ({ ...prev, isActive: event.target.checked }))} /> Active
        </label>
        <LabeledInput ignorePackageLock={true} name="sortOrder" text="Sort" type="number" min={0} value={draft.sortOrder} onChange={(event) => setDraft((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))} />
      </Row>

      <h4>Locked order specs</h4>
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="albumType" text="Album Type" type="Select" options={albumTypeOptions} value={draft.formConfig.albumType} onChange={(option) => updateFormConfig({ albumType: option })} />
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="weight" text="Weight" type="Select" options={weightOptions} value={draft.formConfig.weight} onChange={(option) => updateFormConfig({ weight: option })} />
      <LabeledInput ignorePackageLock={true} name="totalQuantity" text="Total Quantity" type="number" min={minimumQuantity} step={quantityFactor} value={draft.formConfig.totalQuantity} onChange={(event) => {
        const totalQuantity = parseInt(event.target.value, 10);
        const colors = draft.formConfig.colors?.length === 1
          ? [{ ...draft.formConfig.colors[0], quantity: totalQuantity }]
          : draft.formConfig.colors;
        updateFormConfig({ totalQuantity, colors });
      }} />
      <LabeledInput ignorePackageLock={true} name="testPresses" text="Test Presses" type="number" min={minimumTestPresses} value={draft.formConfig.testPresses} onChange={(event) => updateFormConfig({ testPresses: parseInt(event.target.value, 10) })} />
      {(draft.formConfig.colors || []).map((color, index) => (
        <Row key={`color-${index}`}>
          <LabeledInput ignorePackageLock={true} isSearchable={true} name={`color${index}`} text="Color" type="Select" options={getAvailableColors()} showRecordColor={true} value={color.color} onChange={(option) => {
            const colors = draft.formConfig.colors.map((entry, colorIndex) => colorIndex === index ? { ...entry, color: option } : entry);
            updateFormConfig({ colors });
          }} />
          <LabeledInput ignorePackageLock={true} name={`colorQty${index}`} text="Quantity" type="number" min={minimumQuantity} step={quantityFactor} value={color.quantity} onChange={(event) => {
            const colors = draft.formConfig.colors.map((entry, colorIndex) => colorIndex === index ? { ...entry, quantity: parseInt(event.target.value, 10) } : entry);
            updateFormConfig({ colors });
          }} />
        </Row>
      ))}
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="centerLabel" text="Center Label" type="Select" options={centerLabelOptions} value={draft.formConfig.centerLabel} onChange={(option) => updateFormConfig({ centerLabel: option })} />
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="innersleeve" text="Innersleeve" type="Select" options={innersleeveOptions} value={draft.formConfig.innersleeve} onChange={(option) => updateFormConfig({ innersleeve: option })} />
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="outerPackagingType" text="Outer Packaging" type="Select" options={outerPackagingTypeOptions} value={draft.formConfig.outerPackagingType} onChange={(option) => updateFormConfig({ outerPackagingType: option })} />
      {!noneOrSupplied(outerType) && (
        <>
          <LabeledInput ignorePackageLock={true} isSearchable={false} name="outerPackagingPrint" text="Outer Packaging Print" type="Select" options={outerPackagingPrintOptions} value={draft.formConfig.outerPackagingPrint} onChange={(option) => updateFormConfig({ outerPackagingPrint: option })} />
          <LabeledInput ignorePackageLock={true} isSearchable={false} name="outerPackagingFinish" text="Outer Packaging Finish" type="Select" options={outerPackagingFinishOptions} value={draft.formConfig.outerPackagingFinish} onChange={(option) => updateFormConfig({ outerPackagingFinish: option })} />
          <LabeledInput ignorePackageLock={true} isSearchable={false} name="assemblyOption" text="Assembly Option" type="Select" options={assemblyOptionOptions} value={draft.formConfig.assemblyOption} onChange={(option) => updateFormConfig({ assemblyOption: option })} />
        </>
      )}
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="insertType" text="Insert" type="Select" options={insertTypeOptions} value={draft.formConfig.insertType} onChange={(option) => updateFormConfig({ insertType: option })} />
      {!noneOrSupplied(insertType) && (
        <>
          <LabeledInput ignorePackageLock={true} isSearchable={false} name="insertPrint" text="Insert Print" type="Select" options={insertPrintOptions} value={draft.formConfig.insertPrint} onChange={(option) => updateFormConfig({ insertPrint: option })} />
          <LabeledInput ignorePackageLock={true} isSearchable={false} name="insertFinish" text="Insert Finish" type="Select" options={insertFinishOptions} value={draft.formConfig.insertFinish} onChange={(option) => updateFormConfig({ insertFinish: option })} />
        </>
      )}
      <LabeledInput ignorePackageLock={true} isSearchable={false} name="polybag" text="Polybag" type="Select" options={PolybagOptions} value={draft.formConfig.polybag} onChange={(option) => updateFormConfig({ polybag: option })} />

      <Row>
        <button type="button" onClick={handleSave}>{editingId ? "Save package" : "Create package"}</button>
        {editingId && (
          <>
            <button type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft()); }}>Cancel</button>
            <button type="button" onClick={() => handleDelete(editingId)}>Delete</button>
          </>
        )}
      </Row>
    </Card>
  );
};

export default PackageManagementCard;
