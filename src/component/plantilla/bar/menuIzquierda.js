import React from 'react';
import { List, ListItemText, Divider, ListItem } from "@material-ui/core";
import { Link } from 'react-router-dom';

export const MenuIzquierda = ({ classes }) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/datosempresa">
                <i className="material-icons">account_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="DATOS CUENTA" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/listaUsuarios">
                <i className="material-icons">visibility</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Roles de usuarios" />
            </ListItem>
            <ListItem component={Link} button to="/usuarios">
                <i className="material-icons">add_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Usuarios" />
            </ListItem>
            <ListItem component={Link} button to="/menu3">
                <i className="material-icons">border_all</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Menú 3" />
            </ListItem>
            <ListItem component={Link} button to="/menu4">
                <i className="material-icons">local_atm</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Menú 4" />
            </ListItem>
        </List>
        <Divider />
        <List>
            
            <ListItem component={Link} button to="/menu5">
                <i className="material-icons">emoji_people</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="Menú 5" />
            </ListItem>
            

        </List>

    </div>

)