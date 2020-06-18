import React from 'react';
import { List, ListItemText, Divider, ListItem } from "@material-ui/core";
import { Link } from 'react-router-dom';

export const MenuIzquierda = ({ classes }) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/edit/jaap">
                <i className="material-icons">account_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="DATOS JAAP" />
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/lecturas">
                <i className="material-icons">visibility</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="LECTURAS" />
            </ListItem>
            <ListItem component={Link} button to="/facturas">
                <i className="material-icons">add_box</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="ORDEN DE PAGO" />
            </ListItem>
            <ListItem component={Link} button to="/ventas">
                <i className="material-icons">border_all</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="VENTAS" />
            </ListItem>
            <ListItem component={Link} button to="/pagos">
                <i className="material-icons">local_atm</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="REGISTRAR PAGOS" />
            </ListItem>
        </List>
        <Divider />
        <List>
            
            <ListItem component={Link} button to="/socios">
                <i className="material-icons">emoji_people</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="SOCIOS" />
            </ListItem>
            <ListItem component={Link} button to="/medidores">
                <i className="material-icons">access_time</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="MEDIDORES" />
            </ListItem>
            <ListItem component={Link} button to="/suspension">
                <i className="material-icons">access_time</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="SUSPENCIÓN DE SERVICIO" />
            </ListItem>
            <ListItem component={Link} button to="/tarifas">
                <i className="material-icons">monetization_on</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="TARIFAS" />
            </ListItem>

            <ListItem component={Link} button to="/compras">
                <i className="material-icons">shopping_cart</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="COMPRAS" />
            </ListItem>

            <ListItem component={Link} button to="/proveedores">
                <i className="material-icons">group</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="PROVEEDORES" />
            </ListItem>

            <ListItem component={Link} button to="/productos">
                <i className="material-icons">local_parking</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="PRODUCTOS" />
            </ListItem>

            <ListItem component={Link} button to="/servicios">
                <i className="material-icons">build</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="SERVICIOS" />
            </ListItem>
            <ListItem component={Link} button to="/reportes">
                <i className="material-icons">post_add</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="REPORTES" />
            </ListItem>
            <ListItem component={Link} button to="/indicadores">
                <i className="material-icons">bar_chart</i>
                <ListItemText classes={{ primary: classes.listItemText }} primary="INDICADORES" />
            </ListItem>
        </List>

    </div>

)