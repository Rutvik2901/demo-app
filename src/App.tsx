import { Card, CardActions, CardContent, Typography, withStyles, WithStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import "./App.css";
import DialogComponent from "./components/DialogComponent/DialogComponent";
import TeamComponent from "./components/TeamComponent";

export interface employeeData {
  email: String;
  firstName: String;
  lastName: String;
  id: Number;
}

const styles = () => ({
  root: {
    minWidth: 275,
    maxWidth: 400,
    margin: 10,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface IAppProps extends WithStyles<typeof styles> {}

interface IAppState {
  employee: employeeData;
  allEmployees: Array<employeeData>;
  isUpdate: boolean;
  currentSelected: Number;
}

class App extends React.Component<IAppProps, IAppState> {
  private baseUrl = "http://localhost:8080/";
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      employee: { email: "", firstName: "", lastName: "", id: 0 },
      allEmployees: [],
      isUpdate: false,
      currentSelected: 0,
    };
  }

  componentDidMount() {
    fetch(this.baseUrl + "employee")
      .then((res) => res.json())
      .then((res) => this.setState({ allEmployees: res }));
  }

  public handleClickOpen = (id: Number) => {
    if (id) {
      this.setState({ employee: this.state.allEmployees.filter((employee) => employee.id === id)[0], isUpdate: true, currentSelected: id });
    }
  };

  public handleClose = () => {
    this.setState({ employee: { email: "", firstName: "", lastName: "", id: 0 }, isUpdate: false });
  };

  public getEmployee = () => {
    fetch(this.baseUrl + "employee")
      .then((res) => res.json())
      .then((res) => this.setState({ allEmployees: res }));
  };

  public handledone = (isDone: boolean) => {
    if (isDone === false) {
      this.handleClose();
    } else {
      if (!this.state.isUpdate) {
        const employee: any = this.state.employee;
        delete employee.id;

        fetch(this.baseUrl + "employee", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employee),
        }).then(() => {
          this.getEmployee();
        });
        this.setState({ employee: { email: "", firstName: "", lastName: "", id: 0 } });
      } else {
        fetch(this.baseUrl + "employee/" + this.state.currentSelected, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.employee),
        }).then(() => {
          this.getEmployee();
        });
        this.setState({ isUpdate: false, currentSelected: 0 });
      }
    }
  };

  public getValues = (event: any) => {
    this.setState({ employee: { ...this.state.employee, [event.target.id]: event.target.value } });
  };

  public deleteEmployee = (id: Number) => {
    fetch(this.baseUrl + "employee/" + id.toString(), { method: "DELETE" }).then(() => {
      this.getEmployee();
    });
    this.setState({ isUpdate: false });
  };

  public employeeRender = () => {
    const { allEmployees } = this.state;
    const { classes } = this.props;

    if (allEmployees.length) {
      return allEmployees.map((employee: employeeData) => (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {employee.email}
            </Typography>
            <Typography variant="h5" component="h2">
              {employee.firstName.toUpperCase()} {employee.lastName.toUpperCase()}
            </Typography>
          </CardContent>
          <CardActions>
            <EditIcon onClick={() => this.handleClickOpen(employee.id)} />
            <DeleteIcon onClick={() => this.deleteEmployee(employee.id)} />
          </CardActions>
        </Card>
      ));
    } else {
      return <h4>No Employee as of now</h4>;
    }
  };

  render() {
    const { isUpdate, employee, allEmployees } = this.state;
    return (
      <div className="App">
        <DialogComponent
          isUpdate={isUpdate}
          employee={{ first: employee.email, second: employee.firstName, third: employee.lastName }}
          changeValues={(event) => this.getValues(event)}
          types={["email", "firstName", "lastName", "Add Employee"]}
          formType={isUpdate ? "Update Employee Details" : "Create Employee"}
          handleDone={(isDone: boolean) => this.handledone(isDone)}
        />

        {this.employeeRender()}
        <TeamComponent employees={allEmployees} />
      </div>
    );
  }
}

export default withStyles(styles)(App);
