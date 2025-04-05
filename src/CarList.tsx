import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react"
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { Button } from "@mui/material";
ModuleRegistry.registerModules([AllCommunityModule]);
import AddCar from "./AddCar";
import EditCar from "./EditCar";

const BASE_URL = 'https://car-rest-service-carshop.2.rahtiapp.fi';


export type TcarData = {
    brand: string;
    model: string;
    color: string;
    fuel: string;
    modelYear: number;
    price: number;

    _links: {
        self: {
            href: string;
        }
    }
}


export type Tcar = {
    brand: string;
    model: string;
    color: string;
    fuel: string;
    modelYear: number;
    price: number;

}

function CarList() {
    const [cars, setCars] = useState([]);

    const [columnDefs] = useState<ColDef<TcarData>[]>([
        { field: "brand" },
        { field: "model" },
        { field: "color" },
        { field: "fuel" },
        { field: "modelYear", headerName: "Year" },
        { field: "price" },
        {
            headerName: "Edit car",
            cellRenderer: (params: ICellRendererParams<TcarData>) =>
                <EditCar
                    currentCar={params.data as TcarData}
                    updateCar={updateCar}
                />
        },
        {
            field: "_links.self.href", 
            headerName: "Delete",
            cellRenderer: (params: ICellRendererParams) =>
                <Button 
                    color="error"
                    onClick={() => handleDelete(params.value)}
                >
                    Delete
                </Button>
        }
    ]);



    const fetchCars = () => {
        fetch(`${BASE_URL}/cars`)
            .then(response => response.json())
            .then(data => setCars(data._embedded.cars))
            .catch(error => console.error('Error fetching cars:', error));
    }

    const handleDelete = (url: string) => {
        if (window.confirm("Do you want to delete car?"))
            deleteCar(url);
    }

    const deleteCar = (url: string) => {
        const options = {
            method: 'DELETE'
        };

        fetch(url, options)
            .then(() => fetchCars())
            .catch(error => console.log(error))
    }

    const addCar = (car: Tcar) => {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        };

        fetch(`${BASE_URL}/cars`, options)
            .then(() => fetchCars())
            .catch(error => console.error('Error adding car:', error));
    };

    const updateCar = (car: Tcar, url:string) => {
        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        };
        fetch(url, options)
        .then(() => fetchCars())
        .catch(error => console.error('Error adding car:', error));
    }

    useEffect(() => {
        fetchCars();
    }, []);

    return (
        <>
            <div style={{ margin: "10px 0" }}>
                <AddCar addCar={addCar} />
            </div>
            <div style={{ height: 780, width: "85vw" }} >
                <AgGridReact<TcarData>
                    columnDefs={columnDefs}
                    rowData={cars}
                    animateRows={true}

                    getRowId={(params) => params.data._links.self.href}



                />
            </div>
        </>
    );
}

export default CarList;