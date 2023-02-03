/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    describe("When I click ont the new bill button", () => {
      test("Then I should be sent to the new bill form page", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billsContainer = new Bills({
          document,
          onNavigate,
          store,
          bills,
          localStorage: window.localStorage,
        });

        const handleClickNewBill = jest.fn((e) =>
          billsContainer.handleClickNewBill(e)
        );
        const buttonNewBill = screen.getByTestId("btn-new-bill");
        buttonNewBill.addEventListener("click", handleClickNewBill);
        userEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
        document.body.innerHTML = "";
      });
    });

    /* describe("When I click ont the eye icon", () => {
      test("Then a modal should open, displaying the picture of the bill", async () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billsContainer = new Bills({
          document,
          onNavigate,
          store,
          bills,
          localStorage: window.localStorage,
        });

        $.fn.modal = jest.fn();
      const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye);
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        iconEye.addEventListener("click", handleClickIconEye);
        userEvent.click(iconEye);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(screen.getByTestId("modaleFile")).toBeTruthy();
        document.body.innerHTML = "";
      });
    }); */

    describe("When I click on the icon eye", () => {
      test("Then a modal should open, displaying the picture of the bill", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({ data: bills });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const store = null;
        const billsContainer = new Bills({
          document,
          onNavigate,
          store,
          bills,
          localStorage: window.localStorage,
        });

        $.fn.modal = jest.fn(); // this dollar sign is a global function that comes from jQuery
        const handleClickIconEye = jest.fn(billsContainer.handleClickIconEye);
        const iconEye = screen.getAllByTestId("icon-eye")[0];
        iconEye.addEventListener("click", handleClickIconEye(iconEye));
        userEvent.click(iconEye);
        expect(handleClickIconEye).toHaveBeenCalled();

        const billPictureModal = screen.getByTestId("modaleFile");
        expect(billPictureModal).toBeTruthy();
        document.body.innerHTML = "";
      });
    });
  });
});
