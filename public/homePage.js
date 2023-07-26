const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(logout => {
        console.log(logout);
        if (logout.success) {
            location.reload();
        }
    });
};

ApiConnector.current(current => {
    // console.log(current);
    if (current.success) {
        ProfileWidget.showProfile(current.data);
    }
});

const ratesBoard = new RatesBoard();
function requestRates() {
    ApiConnector.getStocks(stocks => {
        // console.log(stocks);
        if (stocks.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(stocks.data);
        }
    });
};

requestRates();

setInterval(requestRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = sum => {
    ApiConnector.addMoney(sum, response => {
        // console.log(response);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Баланс успешно пополнен!");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.conversionMoneyCallback = conv => {
    ApiConnector.convertMoney(conv, response => {
        // console.log(conv);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Конвертация прошла успешно!");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

moneyManager.sendMoneyCallback = trans => {
    ApiConnector.transferMoney(trans, response => {
        console.log(trans);
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, "Перевод совершен успешно!");
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    // console.log(response);
    if (response.success) {
        favoritesWidget.clearTable();
    }
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
});

favoritesWidget.addUserCallback = favor => {
    ApiConnector.addUserToFavorites(favor, response => {
        // console.log(favor);
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.setMessage(true, "Пользователь добавлен!");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    });
};

favoritesWidget.removeUserCallback = id => {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.setMessage(true, "Пользователь удален!");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    });
};