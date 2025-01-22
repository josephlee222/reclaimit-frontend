import React, { useEffect, useState, useContext } from 'react'
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Box, Card, CardContent, Typography, Divider, AppBar, Toolbar, IconButton, Grid2, TextField, useMediaQuery, useTheme, MenuItem } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CardTitle from '../../../components/CardTitle';
import { AddRounded, CloseRounded, FlagRounded, ForestRounded, MapRounded, RefreshRounded, VisibilityRounded } from '@mui/icons-material';
import titleHelper from '../../../functions/helpers';
import { get, post } from "aws-amplify/api";
import { enqueueSnackbar } from 'notistack';
import { CategoryContext } from './ItemRoutes';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ViewItems() {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoryLoading, setCategoryLoading] = useState(true)
    const [deleteLoading, setDeleteLoading] = useState(null)
    const [deleteItemDialog, setDeleteItemDialog] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [category, setCategory] = useState(null)
    const [deleteItem, setDeleteItem] = useState(null)
    const { setActivePage } = useContext(CategoryContext)
    const navigate = useNavigate()
    const theme = useTheme()
    titleHelper("Manage Items")

    const columns = [
        { field: 'name', headerName: 'Item Name', width: 200 },
        { field: 'description', headerName: 'Item Description', minWidth: 150, flex: 1 },
        { field: 'created_at', headerName: 'Found On', type: 'datetime', minWidth: 150, valueGetter: (value) => new Date(value).toLocaleDateString() },
        {
            field: 'actions', headerName: "Actions", type: 'actions', width: 80, getActions: (params) => [
                <GridActionsCellItem
                    icon={<VisibilityRounded />}
                    label="View Item"
                    onClick={() => {
                        
                    }}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Item"
                    onClick={() => {
                        setDeleteItem(params.row)
                        handleDeleteItemOpen()
                    }}
                />
            ]
        },
    ];

    const createItemFormik = useFormik({
        initialValues: {
            name: "",
            category: 1,
            description: ""
        },
        validationSchema: yup.object({
            name: yup.string().required("Item name is required"),
            category: yup.number().required("Item category is required"),
            description: yup.string().required("Item description is required")
        }),
        onSubmit: async (values) => {
            setCreateLoading(true)
            var itemReq = post({
                apiName: "midori",
                path: "/admin/items",
            }, {
                body: values
            })

            try {
                var res = await itemReq.response
                
                enqueueSnackbar("Item created successfully", { variant: "success" })
                setCreateLoading(false)
                handleNewClose()
                handleGetItems()
            } catch (err) {
                console.log(err)
                enqueueSnackbar("Failed to create item", { variant: "error" })
            }
        }
    })


    const handleDeleteItemClose = () => {
        setDeleteItemDialog(false)
    }

    const handleDeleteItemOpen = () => {
        setDeleteItemDialog(true)
    }

    const handleNewClose = () => {
        setCreateDialogOpen(false)
    }

    const handleNewOpen = () => {
        handleGetCategories()
        setCreateDialogOpen(true)
    }

    const handleDeleteItem = () => {
        setDeactivateLoading(true)
        http.delete("/admin/items/" + deleteItem.id).then((res) => {
            if (res.status === 200) {
                setDeleteLoading(false)
                setDeleteFarmDialog(false)
                handleGetItems()
            }
        })
    }

    const handleGetCategories = async () => {
        var itemReq = get({
            apiName: "midori",
            path: "/categories",
        })

        try {
            var res = await itemReq.response
            var data = await res.body.json()
            setCategory(data)
            setCategoryLoading(false)
        } catch (err) {
            console.log(err)
            enqueueSnackbar("Failed to load item categories", { variant: "error" })
        }
    }

    const handleGetItems = async () => {
        setLoading(true)
        var itemReq = get({
            apiName: "midori",
            path: "/admin/items",
        })

        try {
            var res = await itemReq.response
            var data = await res.body.json()
            setItems(data)
            setLoading(false)
        } catch (err) {
            console.log(err)
            enqueueSnackbar("Failed to load items", { variant: "error" })
        }
    }

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    useEffect(() => {
        handleGetItems()
        setActivePage(0)

        // check if param has new
        const urlParams = new URLSearchParams(window.location.search);
        const newParam = urlParams.get('new');
        if (newParam) {
            handleNewOpen()
        }
    }, [])

    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Box display={{ xs: "none", md: "block" }}>
                    <Typography variant="h4" my={"2rem"} fontWeight={700}>Manage Items</Typography>
                    <Divider sx={{ mb: "1rem" }} />
                </Box>
                <Box display={"flex"}>
                    <Button variant="contained" startIcon={<AddRounded />} onClick={handleNewOpen}>New...</Button>
                    <LoadingButton loadingPosition='start' variant="outlined" startIcon={<RefreshRounded />} onClick={handleGetItems} loading={loading} sx={{ ml: "1rem" }}>Refresh</LoadingButton>
                </Box>
                <DataGrid
                    rows={items}
                    columns={columns}
                    pageSize={10}
                    loading={loading}
                    autoHeight
                    slots={{ toolbar: customToolbar }}
                    sx={{ mt: "1rem" }}
                />
            </Box>
            <Dialog open={deleteItemDialog} onClose={handleDeleteItemClose}>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogContent sx={{ paddingTop: 0 }}>
                    <DialogContentText>
                        Are you sure you want to delete the item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteItemClose} startIcon={<CloseIcon />}>Cancel</Button>
                    <LoadingButton type="submit" loadingPosition="start" loading={deleteLoading} variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteItem}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
                open={createDialogOpen}
                onClose={handleNewClose}
                maxWidth="md"
                fullWidth
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleNewClose}
                            aria-label="close"
                        >
                            <CloseRounded />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Create Found Item
                        </Typography>
                        <LoadingButton autoFocus color="inherit" onClick={createItemFormik.handleSubmit} loading={createLoading} loadingPosition='start' startIcon={<AddRounded />}>
                            Create
                        </LoadingButton>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Item Name"
                                variant="outlined"
                                value={createItemFormik.values.name}
                                onChange={createItemFormik.handleChange}
                                error={createItemFormik.touched.name && Boolean(createItemFormik.errors.name)}
                                helperText={createItemFormik.touched.name && createItemFormik.errors.name}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                            <TextField
                                select
                                fullWidth
                                id="category"
                                name="category"
                                label="Item Category"
                                variant="outlined"
                                value={createItemFormik.values.category}
                                onChange={createItemFormik.handleChange}
                                error={createItemFormik.touched.category && Boolean(createItemFormik.errors.category)}
                                helperText={createItemFormik.touched.category && createItemFormik.errors.category}
                            >
                                {category && category.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid2>
                        <Grid2 size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={7}
                                id="description"
                                name="description"
                                label="Description of the item (size, color, model, etc)"
                                variant="outlined"
                                value={createItemFormik.values.description}
                                onChange={createItemFormik.handleChange}
                                error={createItemFormik.touched.description && Boolean(createItemFormik.errors.description)}
                                helperText={createItemFormik.touched.description && createItemFormik.errors.description}
                            />
                        </Grid2>
                    </Grid2>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewItems