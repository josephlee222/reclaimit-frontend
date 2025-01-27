import { useContext, useEffect, useState, Suspense, useRef, useLayoutEffect } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { Button, Container, Divider, Typography, Box, Card, TextField, Skeleton, CardContent, CardMedia, Chip, Alert, Collapse, Grid, Stack, Grid2, useTheme, CardActions } from '@mui/material'
import { AppContext } from '../App';
import { CategoryRounded, HomeRounded, InfoRounded, LoginRounded, NewReleasesRounded, SearchRounded, WarningRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import { useSnackbar } from "notistack";
import CardTitle from '../components/CardTitle';


function Home() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Home")
    const apiUrl = import.meta.env.VITE_API_URL;
    const [banners, setBanners] = useState({})
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme()



    return (
        <>
            <Box sx={{ backgroundColor: theme.palette.primary.main, py: "6rem" }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexDirection: { xs: "column-reverse", md: "row" }, }}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h2" fontWeight={700} sx={{ color: theme.palette.primary.contrastText }}>ReclaimIt</Typography>
                            <Typography variant="h5" fontWeight={400} sx={{ color: theme.palette.primary.contrastText }}>A platform for reclaiming lost items</Typography>

                            <Button variant="white" color="secondary" sx={{ mt: "1rem" }} component={Link} to="/items" startIcon={<SearchRounded />}>Search for items</Button>
                        </Box>
                        <Box>
                            <img src="/lost_and_found.png" alt="Hero" style={{ width: "100%", maxWidth: "300px" }} />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="xl">
                <Typography variant="h5" my={"2rem"} fontWeight={700} sx={{  borderBottom: "3px dashed " + theme.palette.primary.main, width: "fit-content" }}>Latest Found Items</Typography>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ lg: 4, sm: 6, xs: 12 }}>
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
                                <Chip label="Phone" icon={<CategoryRounded />} size='small' />
                            </CardContent>
                            <CardActions>
                                <Button size="small" startIcon={<InfoRounded />}>Item Details</Button>
                            </CardActions>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ lg: 4, sm: 6, xs: 12 }}>
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
                                <Chip label="Phone" icon={<CategoryRounded />} size='small' />
                            </CardContent>
                            <CardActions>
                                <Button size="small" startIcon={<InfoRounded />}>Item Details</Button>
                            </CardActions>
                        </Card>
                    </Grid2>
                    <Grid2 size={{ lg: 4, sm: 6, xs: 12 }}>
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
                                <Chip label="Phone" icon={<CategoryRounded />} size='small' />
                            </CardContent>
                            <CardActions>
                                <Button size="small" startIcon={<InfoRounded />}>Item Details</Button>
                            </CardActions>
                        </Card>
                    </Grid2>
                </Grid2>
            </Container>
        </>
    )
}


export default Home