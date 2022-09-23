import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProgressBar from "../components/ProgressBar";
import App from "../App"
import * as DB from "../store/database"
import {seedTypes, createDefaultUser} from "../store/seeders"
import TypeDropdown from "../components/TypeDropdown";
import { MainProvider } from "../store/contexts";
import AddExpenseBtn from "../components/AddExpenseBtn";


    
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
        <AddExpenseBtn />
      </MainProvider>
    );
  }
  

test("See modal is open onlick", () => {
    renderTypeDropDown();
    
    const btn = screen.getByTestId("addExpense");
    fireEvent.click(btn);

    const modal = screen.getByTestId("modalexpense");
    expect(modal).toBeVisible();
  
})