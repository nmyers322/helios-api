import { useDispatch, useSelector } from "react-redux";
import Card from "../Card"
import { useEffect, useState } from "react";
import { getAllOrdersAdmin } from "../../../modules/heliosApi";
import { setFetchingOrders, updateOrders } from "../../../actions/ordersActions";
import ErrorText from "../../form/main/ErrorText";
import styled from "styled-components";
import { getAttributeValue } from "../../../modules/cart";
import { getOrdersOverviewViewState } from "../../../modules/ordersOverview";
import { setPrintContent, setShowPrintModal } from "../../../actions/metaActions";
import LabeledSpinner from "../../main/LabeledSpinner";

const OrderTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 1rem;
    color: ${props => props.theme.text};
`;

const OrderRow = styled.tr`

    padding: 1rem;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: ${props => props.theme.colors.sideBar.activeOption};
    }
`;

const OrderDetail = styled.td`
    font-size: 1rem;
    color: ${props => props.theme.text};
    padding: 1rem;
    flex-grow: 1;
    text-align: left;
`;

const truncate = (value = "", length = 80) =>
    value.length > length ? `${value.slice(0, length)}...` : value;

const condensedDatetime = (date) => {
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(d);
    const dateParts = parts.filter(part => part.type !== 'literal');
    const dateString = dateParts.map(part => part.value).join('/');
    return dateString.replace(/,/g, '');
}

const OrdersOverviewCard = ({statuses=null}) => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders);
    const openOrders = Object.keys(orders?.orders)
        ?.filter(index => statuses ? statuses.includes(orders.orders[index]?.status) : true)
        ?.map(index => orders.orders[index])
        ?.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
    const [firstLoad, setFirstLoad] = useState(true);
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            dispatch(setFetchingOrders(true));
            let allOrders = await getAllOrdersAdmin();
            if (allOrders.status === 200) {
                dispatch(updateOrders(allOrders.data?.orders));
            } else {
                setErrorText("Error fetching orders");
            }
            dispatch(setFetchingOrders(false));
        }
        if (firstLoad) {
            fetchOrders();
            setFirstLoad(false);
        }
    }, [dispatch]);

    const viewState = getOrdersOverviewViewState({
        fetching: orders?.fetching || firstLoad,
        orders: orders?.orders,
        statuses,
        errorText,
    });

    return (
        <Card title="Orders Overview">
            { viewState === "loading" && <LabeledSpinner text="Loading orders..." /> }
            { viewState !== "loading" && (
            <OrderTable>
                <OrderRow>
                    <OrderDetail>
                        Order ID
                    </OrderDetail>
                    <OrderDetail>
                        Status
                    </OrderDetail>
                    <OrderDetail>
                        Order Details
                    </OrderDetail>
                    <OrderDetail>
                        Comment
                    </OrderDetail>
                    <OrderDetail>
                        Last Updated
                    </OrderDetail>
                </OrderRow>
                { openOrders && Object.keys(openOrders).map((index) => (
                    <OrderRow key={index} onClick={() => {
                        dispatch(setPrintContent({
                            orderId: openOrders[index].id
                        }));
                        dispatch(setShowPrintModal(true));
                    }}>
                        <OrderDetail>
                            {openOrders[index].id}
                        </OrderDetail>
                        <OrderDetail>
                            {openOrders[index].status}
                        </OrderDetail>
                        <OrderDetail>
                            {getAttributeValue(openOrders[index].pricedCart, "catalogNumber")}
                            {` - ${getAttributeValue(openOrders[index].pricedCart, "bandName")}`}
                            {` - ${getAttributeValue(openOrders[index].pricedCart, "albumTitle")}`}
                        </OrderDetail>
                        <OrderDetail>
                            {truncate(openOrders[index].orderComment || "")}
                        </OrderDetail>
                        <OrderDetail>
                            {condensedDatetime(openOrders[index].updatedAt)}
                        </OrderDetail>
                    </OrderRow>
                ))}
            </OrderTable>
            ) }
            { viewState === "empty" && (
                <p>No orders with the specified parameters</p>
            )}
            { errorText && <ErrorText text={errorText} /> }
        </Card>
    );
}
export default OrdersOverviewCard;

/*
{
    "id": 44,
    "userId": 1,
    "externalOrderId": "bank_transfer",
    "externalOrder": null,
    "status": "CREATED",
    "pricedCart": [
        {
            "id": 286,
            "name": "Order Type",
            "sku": "helios-order-type",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "orderType",
                    "value": "12-inch"
                }
            ]
        },
        {
            "id": 282,
            "name": "Band Name",
            "sku": "helios-band-name",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "bandName",
                    "value": "Mania"
                }
            ],
            "heliosUserInput": "Mania"
        },
        {
            "id": 283,
            "name": "Album Title",
            "sku": "helios-album-title",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "albumTitle",
                    "value": "Revel"
                }
            ],
            "heliosUserInput": "Revel"
        },
        {
            "id": 284,
            "name": "Catalog Number",
            "sku": "helios-catalog-number",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "catalogNumber",
                    "value": "EWR-123"
                }
            ],
            "heliosUserInput": "EWR-123"
        },
        {
            "id": 28,
            "name": "12 Inch Base Fee",
            "sku": "helios-12inch-base-fee",
            "quantity": 2,
            "price": 708.75,
            "total": 1417.5
        },
        {
            "id": 86,
            "name": "12 Inch Weight",
            "sku": "helios-12inch-weight",
            "quantity": 1500,
            "variation": [
                {
                    "attribute": "weight",
                    "value": "160g"
                }
            ],
            "total": 795,
            "price": 0.53
        },
        {
            "id": 285,
            "name": "Total Quantity",
            "sku": "helios-total-quantity",
            "quantity": 750
        },
        {
            "id": 342,
            "name": "12 Inch Test Press Setup Fee Double LP",
            "sku": "helios-12inch-test-press-setup-fee-double-lp",
            "quantity": 1,
            "price": 105,
            "total": 105
        },
        {
            "id": 82,
            "name": "12 Inch Test Press",
            "sku": "helios-12inch-test-press",
            "quantity": 30,
            "variation": [
                {
                    "attribute": "albumType",
                    "value": "double"
                }
            ],
            "total": 315,
            "price": 10.5
        },
        {
            "id": 83,
            "name": "12 Inch Color",
            "sku": "helios-12inch-color",
            "quantity": 900,
            "variation": [
                {
                    "attribute": "color",
                    "value": "Black"
                },
                {
                    "attribute": "baseFee",
                    "value": "black"
                },
                {
                    "attribute": "selectedQuantity",
                    "value": 450
                }
            ],
            "total": 1890,
            "price": 2.1
        },
        {
            "id": 83,
            "name": "12 Inch Color",
            "sku": "helios-12inch-color",
            "quantity": 200,
            "variation": [
                {
                    "attribute": "color",
                    "value": "Blood Orange"
                },
                {
                    "attribute": "baseFee",
                    "value": "color"
                },
                {
                    "attribute": "selectedQuantity",
                    "value": 100
                }
            ],
            "total": 556,
            "price": 2.78
        },
        {
            "id": 87,
            "name": "12 Inch Color Setup Fee",
            "sku": "helios-12inch-color-setup-fee",
            "quantity": 4,
            "price": 105,
            "total": 420
        },
        {
            "id": 83,
            "name": "12 Inch Color",
            "sku": "helios-12inch-color",
            "quantity": 400,
            "variation": [
                {
                    "attribute": "color",
                    "value": "Yellow Translucent"
                },
                {
                    "attribute": "baseFee",
                    "value": "color"
                },
                {
                    "attribute": "selectedQuantity",
                    "value": 200
                }
            ],
            "total": 1112,
            "price": 2.78
        },
        {
            "id": 89,
            "name": "12 Inch Center Labels",
            "sku": "helios-12inch-center-labels",
            "quantity": 2,
            "variation": [
                {
                    "attribute": "centerLabel",
                    "value": "color"
                },
                {
                    "attribute": "quantity",
                    "value": "n1000"
                }
            ],
            "total": 336,
            "price": 168
        },
        {
            "id": 525,
            "name": "12 Inch Innersleeve",
            "sku": "helios-12inch-innersleeve",
            "quantity": 1500,
            "variation": [
                {
                    "attribute": "innersleeve",
                    "value": "blackPolylinedSleeve"
                }
            ],
            "total": 870,
            "price": 0.58
        },
        {
            "id": 79,
            "name": "12 Inch Outer Packaging",
            "sku": "helios-12inch-outer-packaging",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "outerPackagingType",
                    "value": "wideSpineJacket"
                },
                {
                    "attribute": "outerPackagingPrint",
                    "value": "color"
                },
                {
                    "attribute": "outerPackagingFinish",
                    "value": "reversePrint"
                },
                {
                    "attribute": "outerPackagingAmount",
                    "value": "n1000"
                }
            ],
            "total": 955.5,
            "price": 955.5
        },
        {
            "id": 80,
            "name": "12 Inch Insert",
            "sku": "helios-12inch-insert",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "insertType",
                    "value": "two"
                },
                {
                    "attribute": "insertPrint",
                    "value": "color"
                },
                {
                    "attribute": "insertFinish",
                    "value": "uncoated"
                },
                {
                    "attribute": "quantity",
                    "value": "n800"
                }
            ],
            "total": 723.45,
            "price": 723.45
        },
        {
            "id": 81,
            "name": "Polybag",
            "sku": "helios-12inch-polybag",
            "quantity": 750,
            "variation": [
                {
                    "attribute": "polybag",
                    "value": "resealablePolybag"
                }
            ],
            "total": 120,
            "price": 0.16
        },
        {
            "id": 102,
            "name": "12 Inch Assembly Option",
            "sku": "helios-12inch-assembly-option",
            "quantity": 1,
            "variation": [
                {
                    "attribute": "assemblyOption",
                    "value": "placeRecordBehindJacket"
                }
            ]
        }
    ],
    "shippingAddress": {
        "address1": "1234 Eternal Warfare St.",
        "address2": null,
        "city": "Portland",
        "country": "US",
        "firstName": "Nate",
        "lastName": "Myers",
        "postcode": "97211",
        "state": "OR"
    },
    "billingAddress": {
        "address1": "1234 Eternal Warfare St.",
        "address2": null,
        "city": "Portland",
        "company": "Eternal Warfare",
        "country": "US",
        "firstName": "Nate",
        "lastName": "Myers",
        "phone": "15035551234",
        "postcode": "97211",
        "state": "OR"
    },
    "selectedShippingOption": {
        "serviceName": "UPS Ground Saver",
        "serviceCode": "ups_ground_saver",
        "totalCost": 1370.88
    },
    "totalPrice": "10986.33",
    "createdAt": "2025-05-20T02:37:12.685+00:00",
    "updatedAt": "2025-05-20T02:37:12.685+00:00"
}*/
