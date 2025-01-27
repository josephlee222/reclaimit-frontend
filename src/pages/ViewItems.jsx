import { useContext, useEffect, useState, Suspense, useRef, useLayoutEffect } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { Button, Container, Divider, Typography, Box, Card, TextField, Skeleton, CardContent, CardMedia, Chip, Alert, Collapse, Grid, Stack, Grid2, useTheme, CardActions, Badge } from '@mui/material'
import { AppContext } from '../App';
import { CategoryRounded, HomeRounded, InfoRounded, LoginRounded, NewReleasesRounded, RefreshRounded, SearchRounded, WarningRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import { useSnackbar } from "notistack";
import { LoadingButton } from '@mui/lab';
import CardTitle from '../components/CardTitle';
import InfoBox from '../components/InfoBox';


export default function ViewItems() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Search Items")
    const apiUrl = import.meta.env.VITE_API_URL;
    const [banners, setBanners] = useState({})
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme()

    const handleGetItems = () => { }

    return (

        <>
            <Container maxWidth="xl">
                <Box sx={{ marginY: "1rem" }}>
                    <Box display={{ xs: "none", md: "block" }}>
                        <Box display={"flex"} alignItems="center">
                            <SearchRounded sx={{ fontSize: "3rem", color: theme.palette.primary.main, mx:"1rem" }} />
                            <Typography variant="h4" my={"2rem"} ml={"1rem"} fontWeight={700}>Search Items</Typography>
                        </Box>
                        
                        <Divider sx={{ mb: "1rem" }} />
                    </Box>
                    <Box display={"flex"}>
                        <LoadingButton loadingPosition='start' variant="outlined" startIcon={<RefreshRounded />} onClick={handleGetItems} loading={loading}>Refresh</LoadingButton>
                    </Box>
                    <Grid2 container spacing={2} sx={{ mt: "1rem" }}>
                        <Grid2 size={{ md: 3, xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <CardTitle title="Category Filter" icon={<CategoryRounded />} />
                                </CardContent>
                            </Card>
                        </Grid2>
                        <Grid2 size={{ md: 9, xs: 12 }}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={{ lg: 4,sm: 6, xs: 12 }}>
                                    <Card sx={{ width: "100%" }}>
                                        <CardMedia
                                            sx={{ height: 200 }}
                                            image="/about_bg.jpg"
                                            title="Background"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" fontWeight={700}>
                                                Samsung Phone
                                            </Typography>
                                            <Chip label="Phone" icon={<CategoryRounded/>} size='small' />
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" startIcon={<InfoRounded/>}>Item Details</Button>
                                        </CardActions>
                                    </Card>
                                </Grid2>
                                <Grid2 size={{ lg: 4,sm: 6, xs: 12 }}>
                                    <Card sx={{ width: "100%" }}>
                                        <CardMedia
                                            sx={{ height: 200 }}
                                            image="/about_bg.jpg"
                                            title="Background"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" fontWeight={700}>
                                                Samsung Phone
                                            </Typography>
                                            <Chip label="Phone" icon={<CategoryRounded/>} size='small' />
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" startIcon={<InfoRounded/>}>Item Details</Button>
                                        </CardActions>
                                    </Card>
                                </Grid2>
                                <Grid2 size={{ lg: 4,sm: 6, xs: 12 }}>
                                    <Card sx={{ width: "100%" }}>
                                        <CardMedia
                                            sx={{ height: 200 }}
                                            image="/about_bg.jpg"
                                            title="Background"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" fontWeight={700}>
                                                Samsung Phone
                                            </Typography>
                                            <Chip label="Phone" icon={<CategoryRounded/>} size='small' />
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" startIcon={<InfoRounded/>}>Item Details</Button>
                                        </CardActions>
                                    </Card>
                                </Grid2>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Box>
            </Container>
        </>
    )
}