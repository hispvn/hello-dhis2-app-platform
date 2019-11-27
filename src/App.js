import React, { useEffect, useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";

const MyApp = () => {
  const engine = useDataEngine();
  const [dataElements, setDataElements] = useState([]);

  useEffect(() => {
    handleLoadDataElement();
  }, []);

  const handleLoadDataElement = async () => {
    let query = {
      dataElements: {
        resource: "dataElements",
        params: {
          order: "lastUpdated:desc",
          pageSize: 10
        }
      }
    };
    let data = await engine.query(query);
    setDataElements([...data.dataElements.dataElements]);
  };

  const handleMutateDataElement = async dataElement => {
    const mutation = {
      resource: "dataElements",
      id: dataElement.id,
      type: "update",
      partial: true,
      data: variables => {
        return {
          name: variables.dataElement.displayName + " - Pato"
        };
      }
    };
    let data = await engine.mutate(mutation, {
      variables: { dataElement: dataElement }
    });
  };

  const updateEvent = async () => {
    const mutation = {
      resource: "events",
      type: "create",
      data: {}
    };
    let data = await engine.mutate(mutation);
  };
  return (
    <div className="container">
      {dataElements.map(dataElement => (
        <div style={{ padding: 10 }}>
          {dataElement.id} - {dataElement.displayName} -{" "}
          <button
            onClick={() => {
              handleMutateDataElement(dataElement);
            }}
          >
            UPDATE
          </button>
        </div>
      ))}
      <button onClick={updateEvent}>UPDATE EVENT</button>
    </div>
  );
};

export default MyApp;
