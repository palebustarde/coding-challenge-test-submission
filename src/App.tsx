import React from "react";
import { useState } from "react";
import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/userFormFields";
import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import { FormFields } from "./types";
import Form from "@/components/Form/Form";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */

  const initialFields: FormFields = {
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  };

  const { fields, onChange } = useFormFields(initialFields);

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const { addAddress } = useAddressBook();

  // const [postCode, setPostCode] = React.useState("");
  // const [houseNumber, setHouseNumber] = React.useState("");
  // const [firstName, setFirstName] = React.useState("");
  // const [lastName, setLastName] = React.useState("");
  // const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  // const [error, setError] = React.useState<undefined | string>(undefined);
  // const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  //const { addAddress } = useAddressBook();

  /**
   * Text fields onChange handlers
   */
  /*
  const handlePostCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPostCode(e.target.value);

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHouseNumber(e.target.value);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);
  */

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */

  const transformAddress = (addresses: AddressType[], houseNumber: string) => {
    return addresses.map((address) => ({ ...address, houseNumber }));
  };

  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [loading, setLoading] = useState(false);
    try {
      setLoading(true);
      setAddresses([]);

      const form = e.target;
      const fields = form.elements;
      const postCode = fields.item(0) as HTMLInputElement;
      const houseNumber = fields.item(1) as HTMLInputElement;
      const response = await fetch(
        `https://api.postcodes.io/api/getAddresses?postcode=${postCode.value}&streetnumber=${houseNumber.value}`
      );
      const data = await response.json();
      setAddresses(transformAddress(data, houseNumber.value));
      setError("");
    } catch (error) {
      setError("Error was encountered where accessing the api.");
      setAddresses([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (
    e: React.ChangeEvent<HTMLFormElement>,
    fields: FormFields
  ) => {
    e.preventDefault();

    if (!fields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    const firstName = fields.firstName.trim();
    const lastName = fields.lastName.trim();

    if (!firstName && !lastName) {
      setError("First name and last name fields mandatory!");
    }

    addAddress({ ...foundAddress, firstName, lastName });
  };

  const handlePostCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // handle post code change
  };

  const handleHouseNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // handle house number change
  };

  const formFields = [
    {
      name: "postCode",
      placeholder: "Post Code",
      value: "",
      onChange: handlePostCodeChange,
    },
    {
      name: "houseNumber",
      placeholder: "House number",
      value: "",
      onChange: handleHouseNumberChange,
    },
  ];

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <Form
          onFormSubmit={handleAddressSubmit}
          legend="Find an address"
          fields={fields}
          submitText="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFirstNameChange}
                  value={firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
