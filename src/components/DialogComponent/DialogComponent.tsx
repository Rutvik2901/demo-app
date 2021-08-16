import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import React from "react";

interface IDialogComponentProps {
  employee: { first: String; second: String; third: String };
  types: Array<string>;
  changeValues: (event: any) => void;
  formType: String;
  isUpdate: boolean;
  handleDone: any;
  // dialogCloseDone: () => void;
}
interface IDialogComponentState {
  dialogOpen: boolean;
}

class DialogComponent extends React.Component<IDialogComponentProps, IDialogComponentState> {
  constructor(props: IDialogComponentProps) {
    super(props);

    this.state = {
      dialogOpen: false,
    };
  }

  componentDidUpdate(prevProps: IDialogComponentProps, prevState: IDialogComponentState) {
    console.log(prevProps.isUpdate, this.props.isUpdate);
    if (prevProps.isUpdate !== this.props.isUpdate && prevProps.isUpdate === false) {
      this.handleOpen();
    }
  }

  public handleClose = () => {
    this.setState({ dialogOpen: false });
    this.props.handleDone(false);
  };

  public handleDone = () => {
    this.setState({ dialogOpen: false });
    this.props.handleDone(true);
  };

  public handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const { employee, types, formType } = this.props;
    return (
      <>
        <Button variant="outlined" color="primary" onClick={() => this.handleOpen()}>
          {types[3]}
        </Button>
        <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{formType}</DialogTitle>
          <DialogContent>
            <DialogContentText>Please Enter the details</DialogContentText>
            <TextField autoFocus margin="dense" id={types[0]} label={"Enter" + types[0]} type="email" fullWidth value={employee.first} onChange={this.props.changeValues} />
            <TextField margin="dense" id={types[1]} label={"Enter" + types[1]} type="name" fullWidth value={employee.second} onChange={this.props.changeValues} />
            <TextField margin="dense" id={types[2]} label={"Enter" + types[2]} type="name" fullWidth value={employee.third} onChange={this.props.changeValues} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDone} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default DialogComponent;
