import { Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, WithStyles, withStyles } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { employeeData } from "../App";
import DialogComponent from "./DialogComponent/DialogComponent";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

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

export interface TeamModel {
  teamNumber: String;
  teamName: String;
  projectName: String;
  employee: Array<employeeData> | [];
  id: Number;
}

interface UpdateMember {
  add: Array<String>;
  remove: Array<String>;
}

interface ITeamComponentProps extends WithStyles<typeof styles> {
  employees: Array<employeeData>;
}
interface ITeamComponentState {
  team: TeamModel;
  isUpdate: boolean;
  allTeam: Array<TeamModel>;
  currentSelected: Number;
  value: Array<String>;
  prevValue: UpdateMember;
  add: boolean;
  open: boolean;
  fromOnChange: boolean;
}

class TeamComponent extends React.Component<ITeamComponentProps, ITeamComponentState> {
  private baseUrl = "http://localhost:8080/";
  constructor(props: ITeamComponentProps) {
    super(props);
    this.state = {
      team: { teamNumber: "", teamName: "", projectName: "", employee: [], id: 0 },
      isUpdate: false,
      allTeam: [],
      currentSelected: 0,
      value: [],
      add: false,
      open: false,
      prevValue: { add: [], remove: [] },
      fromOnChange: false,
    };
  }

  componentDidMount() {
    this.getTeam();
  }

  componentDidUpdate(prevProps: ITeamComponentProps, prevState: ITeamComponentState) {
    const { value, prevValue, fromOnChange, currentSelected, allTeam } = this.state;
    if (prevState.value !== value && fromOnChange) {
      const testing = value.filter((t) => prevState.value.indexOf(t) === -1);
      const testing2 = prevState.value.filter((t) => value.indexOf(t) === -1);
      console.log("prev: ", testing, testing2);
      if (testing.length) {
        console.log("prev herer -1", prevValue.remove.indexOf(testing[0]));
        if (prevValue.remove.indexOf(testing[0]) !== -1) {
          this.setState({ prevValue: { ...this.state.prevValue, remove: prevValue.remove.filter((e) => e !== testing[0]) } });
        }
        const t = allTeam.filter((e) => e.id === currentSelected)[0];
        console.log(
          "prev herer0",
          t.employee.filter((q) => q.email === testing[0])
        );
        if (t.employee.filter((t) => t.email === testing[0]).length === 0) this.setState({ prevValue: { ...this.state.prevValue, add: [...this.state.prevValue.add, testing[0]] } });
      } else if (testing2.length) {
        console.log("prev herer1", prevValue.add.indexOf(testing2[0]));
        if (prevValue.add.indexOf(testing2[0]) !== -1) {
          console.log("prev herer2", prevValue.add.indexOf(testing2[0]));
          this.setState({ prevValue: { ...this.state.prevValue, add: prevValue.add.filter((e) => e != testing2[0]) } });
        }
        const t = allTeam.filter((e) => e.id === currentSelected)[0];
        if (t.employee.filter((r) => r.email === testing2[0]).length) {
          this.setState({ prevValue: { ...this.state.prevValue, remove: [...this.state.prevValue.remove, testing2[0]] } });
        }
      }
      this.setState({ fromOnChange: false });
    }
  }

  public getValues = (event: any) => {
    this.setState({ team: { ...this.state.team, [event.target.id]: event.target.value } });
  };

  public handleClose = () => {
    this.setState({ team: { teamNumber: "", teamName: "", projectName: "", employee: [], id: 0 } });
  };

  public getTeam = () => {
    fetch(this.baseUrl + "teams")
      .then((res) => res.json())
      .then((res) => this.setState({ allTeam: res }));
  };

  public handledone = (check: boolean) => {
    if (check === false) {
      this.handleClose();
    } else {
      if (!this.state.isUpdate) {
        const temp: any = this.state.team;
        delete temp.id;
        fetch(this.baseUrl + "teams", {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        }).then(() => {
          this.getTeam();
        });
        this.setState({ team: { teamNumber: "", teamName: "", projectName: "", employee: [], id: 0 } });
      } else {
        fetch(this.baseUrl + "teams/" + this.state.currentSelected, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.team),
        }).then(() => {
          this.getTeam();
        });
        this.setState({ isUpdate: false, currentSelected: 0 });
      }
    }
  };

  public handleClickOpen = (id: Number) => {
    if (id) {
      this.setState({ team: this.state.allTeam.filter((team) => team.id === id)[0], isUpdate: true, currentSelected: id });
    }
  };

  public deleteTeam = (id: Number) => {
    fetch(this.baseUrl + "teams/" + id, { method: "DELETE" }).then(() => {
      this.getTeam();
    });
    this.setState({ isUpdate: false });
  };

  public addTeamMembers = (id: Number) => {
    let temp = this.state.allTeam.filter((e) => e.id === id);
    const temp1 = temp[0].employee.map((e) => e.email);

    this.setState({ open: true, currentSelected: id, value: temp1, team: temp[0] });
  };

  handleDialogClose = () => {
    this.setState({
      open: !this.state.open,
      prevValue: { add: [], remove: [] },
    });
  };

  handleAdd = () => {
    const { prevValue } = this.state;
    this.setState({
      open: false,
      add: false,
    });
    const q: any = [];
    const u: any = [];
    // this.state.value.forEach((e) => {
    //   q.push(this.props.employees.filter((t) => t.email === e)[0]);
    // });
    prevValue.add.forEach((e) => {
      q.push(this.props.employees.filter((t) => t.email === e)[0]);
    });

    const test = q.map((t: employeeData) => t.id);

    prevValue.remove.forEach((e) => {
      u.push(this.props.employees.filter((t) => t.email === e)[0]);
    });
    const test1 = u.map((t: employeeData) => t.id);

    // const test = q.map((t: any) => t.id);

    fetch(this.baseUrl + "addMember/teams/" + this.state.currentSelected, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ add: test, remove: test1 }),
    }).then(() => {
      this.getTeam();
      this.setState({
        prevValue: { add: [], remove: [] },
      });
    });
  };

  public addTeamMembersComponent = () => {
    return (
      <Dialog open={this.state.open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            id="fixed-tags-demo"
            value={this.state.value}
            onChange={(event, newValue) => {
              console.log("newValue: ", newValue);

              this.setState({ value: newValue, fromOnChange: true });
            }}
            options={this.props.employees.map((temp) => temp.email)}
            getOptionLabel={(option: String) => option.toString()}
            renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)}
            style={{ width: 500 }}
            renderInput={(params) => <TextField {...params} label="Select Employees" variant="outlined" placeholder="Employees" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleAdd} color="primary">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  public teamRender = () => {
    const { allTeam } = this.state;
    const { classes } = this.props;

    if (allTeam.length) {
      return allTeam.map((team: TeamModel) => (
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {team.teamNumber}
            </Typography>
            <Typography variant="h5" component="h2">
              {team.teamName.toUpperCase()}
            </Typography>
            <Typography>
              Team Members
              {team.employee.map((emp) => (
                <div>
                  {/* Team Members -- */}
                  {emp.email}
                </div>
              ))}
            </Typography>
          </CardContent>
          <CardActions>
            <EditIcon onClick={() => this.handleClickOpen(team.id)} />
            <DeleteIcon onClick={() => this.deleteTeam(team.id)} />
            <PersonAddIcon onClick={() => this.addTeamMembers(team.id)} />
          </CardActions>
        </Card>
      ));
    } else {
      return <h4>No Team as of now</h4>;
    }
  };

  render() {
    const { team, isUpdate, prevValue } = this.state;
    console.log("prevValue: ", prevValue);
    return (
      <>
        <DialogComponent
          isUpdate={isUpdate}
          employee={{ first: team.teamNumber, second: team.teamName, third: team.projectName }}
          changeValues={(event) => this.getValues(event)}
          types={["teamNumber", "teamName", "projectName", "Add Team"]}
          formType={isUpdate ? "Update Team Details" : "Create Team"}
          handleDone={(check: boolean) => this.handledone(check)}
        />
        {this.teamRender()}
        {this.addTeamMembersComponent()}
      </>
    );
  }
}

export default withStyles(styles)(TeamComponent);
