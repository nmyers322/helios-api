import { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../Card";
import {
  createColorAdmin,
  deleteColorAdmin,
  fetchAvailableColors,
  getAllColorsAdmin,
  updateColorAdmin,
} from "../../../modules/heliosApi";
import { setAvailableColors } from "../../../modules/colors";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const HeaderCell = styled.th`
  text-align: left;
  border-bottom: 1px solid #ccc;
  padding: 0.6rem;
`;

const Cell = styled.td`
  border-bottom: 1px solid #ddd;
  padding: 0.6rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.35rem;
`;

const SmallNumberInput = styled.input`
  width: 5rem;
  box-sizing: border-box;
  padding: 0.35rem;
`;

const ErrorText = styled.p`
  color: #b00020;
`;

const toAdminColorPayload = (color) => ({
  name: String(color.name || "").trim(),
  hexColor: String(color.hexColor || "").trim().toUpperCase(),
  isActive: !!color.isActive,
  sortOrder: Number(color.sortOrder ?? 0),
});

const normalizeHexColor = (value = "") => {
  const normalized = value.trim().toUpperCase();
  return normalized.startsWith("#") ? normalized : `#${normalized}`;
};

const isValidHex = (value = "") => /^#[0-9A-F]{6}$/.test(value);

const ColorManagementCard = () => {
  const [colors, setColors] = useState([]);
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newColor, setNewColor] = useState({
    name: "",
    hexColor: "#000000",
    isActive: true,
    sortOrder: 0,
  });

  const syncPublicColorOptions = async () => {
    const result = await fetchAvailableColors();
    if (result?.status === 200 && Array.isArray(result?.data)) {
      setAvailableColors(result.data);
    }
  };

  const loadAdminColors = async () => {
    setIsLoading(true);
    setErrorText("");
    const result = await getAllColorsAdmin();
    if (result?.status === 200 && Array.isArray(result?.data?.colors)) {
      setColors(result.data.colors);
    } else {
      setErrorText("Error loading record colors");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAdminColors();
  }, []);

  const handleCreateColor = async () => {
    const payload = toAdminColorPayload({
      ...newColor,
      hexColor: normalizeHexColor(newColor.hexColor),
    });
    if (!payload.name) {
      setErrorText("Name is required");
      return;
    }
    if (!isValidHex(payload.hexColor)) {
      setErrorText("Hex color must be in #RRGGBB format");
      return;
    }
    setErrorText("");
    const result = await createColorAdmin(payload);
    if (result?.status !== 201) {
      setErrorText(result?.response?.data?.error || "Error creating color");
      return;
    }
    setNewColor({
      name: "",
      hexColor: "#000000",
      isActive: true,
      sortOrder: 0,
    });
    await loadAdminColors();
    await syncPublicColorOptions();
  };

  const handleUpdateColor = async (color) => {
    const payload = toAdminColorPayload({
      ...color,
      hexColor: normalizeHexColor(color.hexColor),
    });
    if (!payload.name) {
      setErrorText("Name is required");
      return;
    }
    if (!isValidHex(payload.hexColor)) {
      setErrorText("Hex color must be in #RRGGBB format");
      return;
    }
    setErrorText("");
    const result = await updateColorAdmin(color.id, payload);
    if (result?.status !== 200) {
      setErrorText(result?.response?.data?.error || "Error updating color");
      return;
    }
    await loadAdminColors();
    await syncPublicColorOptions();
  };

  const handleDeleteColor = async (colorId) => {
    setErrorText("");
    const result = await deleteColorAdmin(colorId);
    if (result?.status !== 204) {
      setErrorText(result?.response?.data?.error || "Error deleting color");
      return;
    }
    await loadAdminColors();
    await syncPublicColorOptions();
  };

  const updateRow = (index, patch) => {
    setColors((prev) =>
      prev.map((color, rowIndex) =>
        rowIndex === index
          ? { ...color, ...patch }
          : color
      )
    );
  };

  return (
    <Card title="Record Colors">
      <p>Manage available record color options shown in the order flow.</p>
      {errorText && <ErrorText>{errorText}</ErrorText>}

      <Table>
        <thead>
          <tr>
            <HeaderCell>Name</HeaderCell>
            <HeaderCell>Hex</HeaderCell>
            <HeaderCell>Preview</HeaderCell>
            <HeaderCell>Sort</HeaderCell>
            <HeaderCell>Active</HeaderCell>
            <HeaderCell>Actions</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {colors.map((color, index) => (
            <tr key={color.id}>
              <Cell>
                <SmallInput
                  value={color.name}
                  onChange={(event) => updateRow(index, { name: event.target.value })}
                />
              </Cell>
              <Cell>
                <SmallInput
                  value={color.hexColor}
                  onChange={(event) => updateRow(index, { hexColor: event.target.value })}
                />
              </Cell>
              <Cell>
                <SmallInput
                  type="color"
                  value={isValidHex(normalizeHexColor(color.hexColor)) ? normalizeHexColor(color.hexColor) : "#000000"}
                  onChange={(event) => updateRow(index, { hexColor: event.target.value })}
                />
              </Cell>
              <Cell>
                <SmallNumberInput
                  type="number"
                  min={0}
                  value={color.sortOrder}
                  onChange={(event) => updateRow(index, { sortOrder: Number(event.target.value) })}
                />
              </Cell>
              <Cell>
                <input
                  type="checkbox"
                  checked={!!color.isActive}
                  onChange={(event) => updateRow(index, { isActive: event.target.checked })}
                />
              </Cell>
              <Cell>
                <Actions>
                  <button type="button" onClick={() => handleUpdateColor(color)}>Save</button>
                  <button type="button" onClick={() => handleDeleteColor(color.id)}>Delete</button>
                </Actions>
              </Cell>
            </tr>
          ))}
        </tbody>
      </Table>

      {!isLoading && (
        <>
          <h3>Add New Color</h3>
          <Table>
            <tbody>
              <tr>
                <Cell>
                  <SmallInput
                    placeholder="Color name"
                    value={newColor.name}
                    onChange={(event) => setNewColor((prev) => ({ ...prev, name: event.target.value }))}
                  />
                </Cell>
                <Cell>
                  <SmallInput
                    placeholder="#RRGGBB"
                    value={newColor.hexColor}
                    onChange={(event) => setNewColor((prev) => ({ ...prev, hexColor: event.target.value }))}
                  />
                </Cell>
                <Cell>
                  <SmallInput
                    type="color"
                    value={isValidHex(normalizeHexColor(newColor.hexColor)) ? normalizeHexColor(newColor.hexColor) : "#000000"}
                    onChange={(event) => setNewColor((prev) => ({ ...prev, hexColor: event.target.value }))}
                  />
                </Cell>
                <Cell>
                  <SmallNumberInput
                    type="number"
                    min={0}
                    value={newColor.sortOrder}
                    onChange={(event) => setNewColor((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
                  />
                </Cell>
                <Cell>
                  <input
                    type="checkbox"
                    checked={!!newColor.isActive}
                    onChange={(event) => setNewColor((prev) => ({ ...prev, isActive: event.target.checked }))}
                  />
                </Cell>
                <Cell>
                  <button type="button" onClick={handleCreateColor}>Create</button>
                </Cell>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );
};

export default ColorManagementCard;
