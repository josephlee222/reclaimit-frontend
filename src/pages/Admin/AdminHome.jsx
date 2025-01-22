import { useContext, useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Test from '../Test'
import { AppContext } from '../../App'
import { useSnackbar } from 'notistack'
import { Card, CardContent, Grid, Typography, ButtonBase, Stack, Chip, IconButton, Box, Skeleton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AssignmentLateRounded, QueryStatsRounded, AppsRounded, TaskAltRounded, MapRounded, ForestRounded, GrassRounded, SettingsRounded, Looks3Rounded, LooksTwoRounded, LooksOneRounded, PersonRounded, GroupRounded, ContentPasteOffRounded, CloseRounded, MoreVertRounded, WarningRounded, RefreshRounded, AddRounded, FlagRounded, Visibility, VisibilityRounded, DeleteRounded } from '@mui/icons-material'
import CardTitle from '../../components/CardTitle'
import http from '../../http'
import titleHelper from '../../functions/helpers';
import { LayoutContext } from './AdminRoutes'
import { get } from 'aws-amplify/api'
import TaskDialog from '../../components/TaskDialog'
import TaskPopover from '../../components/TaskPopover'
import UserInfoPopover from '../../components/UserInfoPopover'
import { LoadingButton } from '@mui/lab'
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid'

export default function AdminHome() {
    //Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setAdminPage, user } = useContext(AppContext);
    const { setContainerWidth } = useContext(LayoutContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [detailsId, setDetailsId] = useState(null);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [UserInfoPopoverOpen, setUserInfoPopoverOpen] = useState(false);
    const [UserInfoPopoverAnchorEl, setUserInfoPopoverAnchorEl] = useState(null);
    const [UserInfoPopoverUserId, setUserInfoPopoverUserId] = useState(null);
    const [ItemsLoading, setItemsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const nf = new Intl.NumberFormat();

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    const useStyles = makeStyles(theme => ({
        outerDiv: {
            '&:hover': {
                "& $divIcon": {
                    opacity: "0.15",
                    bottom: "-28px",
                    right: "-28px",
                    rotate: "-15deg"
                }
            }
        },
        divIcon: {
            opacity: "0",
            transitionDuration: "1s"
        }
    }));

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
                    icon={<DeleteRounded />}
                    label="Delete Item"
                    onClick={() => {
                        setDeleteItem(params.row)
                        handleDeleteItemOpen()
                    }}
                />
            ]
        },
    ];

    const iconStyles = { position: "absolute", bottom: "-48px", right: "-48px", width: "128px", height: "128px", transition: "0.5s", display: { xs: "none", md: "initial" } }

    const classes = useStyles();

    const handleDetailsClick = (id) => {
        setDetailsId(id)
        setDetailsDialogOpen(true)
    }

    const handleOptionsClick = (event, id) => {
        setDetailsId(id)
        setAnchorEl(event.currentTarget);
        setOptionsOpen(true)
    };

    const handleDetailsClose = () => {
        setDetailsDialogOpen(false)
    }

    const handleOnDelete = () => {
        setOptionsOpen(false)
        setDetailsDialogOpen(false)
        HandleGetItems()
    }

    const handleOptionsClose = () => {
        setAnchorEl(null);
        setOptionsOpen(false)
    }


    const generateSkeletons = () => {
        let skeletons = []
        for (let i = 0; i < 3; i++) {
            skeletons.push(
                <Card variant='draggable'>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Typography variant="h6" fontWeight={700} mr={"1rem"}><Skeleton width={"15rem"} animation='wave' /></Typography>
                        </Box>
                        <Stack direction="row" spacing={1} mt={2}>
                            <Skeleton width={"5rem"} animation='wave' />
                            <Skeleton width={"5rem"} animation='wave' />
                            <Skeleton width={"5rem"} animation='wave' />
                        </Stack>
                        <Typography mt={"0.5rem"} fontSize={"0.75rem"} color='grey'><Skeleton width={"8.5rem"} animation='wave' /></Typography>
                    </CardContent>
                </Card>
            )
        }
        return skeletons
    }

    const generateTask = (task) => {
        return (
            <Card variant='draggable'>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
                        <ButtonBase sx={{ width: "100%", justifyContent: 'start', borderRadius: "10px", mt: "0.25rem" }} onClick={() => handleDetailsClick(task.id)}>
                            <Typography variant="h6" fontWeight={700} mr={"1rem"} textAlign={"start"}>{task.title}</Typography>
                        </ButtonBase>
                        <IconButton onClick={(e) => { handleOptionsClick(e, task.id) }}><MoreVertRounded /></IconButton>
                    </Box>
                    <Stack direction="row" spacing={1} mt={2}>
                        {task.priority === 3 && <Chip icon={<Looks3Rounded />} label="Low" color="info" size='small' />}
                        {task.priority === 2 && <Chip icon={<LooksTwoRounded />} label="Medium" color="warning" size='small' />}
                        {task.priority === 1 && <Chip icon={<LooksOneRounded />} label="High" color="error" size='small' />}
                        <Chip icon={<PersonRounded />} label={task.created_by} size='small' onClick={(e) => { handleShowUserInformation(e, task.created_by) }} />
                        <Chip icon={<GroupRounded />} label={`${task.users_assigned} Assigned`} size='small' />
                    </Stack>
                    <Typography mt={"0.5rem"} fontSize={"0.75rem"} color='grey'>Created on {task.created_at}</Typography>
                </CardContent>
            </Card>
        )

    }



    const generateNoTasks = () => {
        return (
            <Card variant='draggable'>
                <CardContent>
                    <Stack color={"grey"} spacing={"0.5rem"} sx={{ display: "flex", justifyItems: "center", alignItems: "center" }}>
                        <ContentPasteOffRounded sx={{ height: "48px", width: "48px" }} />
                        <Typography variant="h6" fontWeight={700}>No items available</Typography>
                    </Stack>
                </CardContent>
            </Card>
        )
    }


    const handleShowUserInformation = (e, userId) => {
        setUserInfoPopoverUserId(userId)
        setUserInfoPopoverOpen(true)
        setUserInfoPopoverAnchorEl(e.currentTarget)
    }

    const HandleGetItems = async () => {
        // Fetch all tasks
        setItemsLoading(true)
        var req = get({
            apiName: "midori",
            path: "/admin/items/today",
        })

        try {
            var res = await req.response
            var data = await res.body.json()
            setItems(data)
            setItemsLoading(false)
        } catch (err) {
            console.log(err)
            enqueueSnackbar("Failed to get items", { variant: "error" })
            setItemsLoading(false)
        }
    }


    useEffect(() => {
        setContainerWidth("xl")
        setAdminPage(true)
        HandleGetItems()
    }, [])



    titleHelper("Main Dashboard")

    return (
        <>
            <Box my={"1rem"}>
                <Card>
                    <CardContent>
                        <CardTitle title="Staff Shortcuts" icon={<AppsRounded />} />
                        <Grid container spacing={2} mt={"0"}>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/items" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <FlagRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>View Items</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Manage Lost & Found Items</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <FlagRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card variant='draggable'>
                                    <ButtonBase className={classes.outerDiv} component={Link} to="/staff/items?new=true" sx={{ width: "100%", justifyContent: 'start' }}>
                                        <CardContent sx={{ color: "primary.main" }}>
                                            <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "initial" }} spacing={{ xs: "1rem", md: 1 }}>
                                                <AddRounded sx={{ width: { xs: "24px", sm: "36px" }, height: { xs: "24px", sm: "36px" } }} />
                                                <Box>
                                                    <Typography variant="h6" fontWeight={700}>Create Item</Typography>
                                                    <Typography variant="body1" sx={{ display: { xs: "none", sm: "initial" } }}>Create a Found Item</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                        <AddRounded className={classes.divIcon} sx={iconStyles} />
                                    </ButtonBase>
                                </Card>
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>
                <Grid container spacing={2} mt={"0.5rem"}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <CardTitle title="Items Found Today" icon={<AssignmentLateRounded />} />
                                    <LoadingButton onClick={HandleGetItems} loading={ItemsLoading} variant="text" startIcon={<RefreshRounded />} loadingPosition='start' size='small'>Refresh</LoadingButton>
                                </Box>
                                <DataGrid
                                    rows={items}
                                    columns={columns}
                                    pageSize={10}
                                    loading={ItemsLoading}
                                    autoHeight
                                    slots={{ toolbar: customToolbar }}
                                    sx={{ mt: "1rem" }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box >
            <TaskDialog open={detailsDialogOpen} onClose={handleDetailsClose} taskId={detailsId} onDelete={handleOnDelete} onUpdate={HandleGetItems} />
            <TaskPopover open={optionsOpen} anchorEl={anchorEl} onClose={handleOptionsClose} onTaskDetailsClick={() => { setDetailsDialogOpen(true); handleOptionsClose() }} onDelete={handleOnDelete} taskId={detailsId} />
            <UserInfoPopover open={UserInfoPopoverOpen} anchor={UserInfoPopoverAnchorEl} onClose={() => setUserInfoPopoverOpen(false)} userId={UserInfoPopoverUserId} />
        </>
    )
}

