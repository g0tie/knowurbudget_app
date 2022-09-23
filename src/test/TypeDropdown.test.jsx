import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProgressBar from "../components/ProgressBar";
import App from "../App"
import * as DB from "../store/database"
import {seedTypes, createDefaultUser} from "../store/seeders"
import TypeDropdown from "../components/TypeDropdown";
import { MainProvider } from "../store/contexts";


    
beforeAll(async () => {
    await DB.createDatabase();
    await DB.createTables();
    await seedTypes();
    await createDefaultUser();
    await DB.getCurrentUser();
})

function renderTypeDropDown() {
    return render(
      <MainProvider>
        <TypeDropdown />
      </MainProvider>
    );
  }
  

test("See if type dropdown types has correct value", () => {
    renderTypeDropDown();
    
    const typeSelector = screen.getByTestId("select");
    fireEvent.change(typeSelector, { target: { value: 2}});
    expect(typeSelector.options[typeSelector.selectedIndex].text).toBe("Vehicule");
  
})