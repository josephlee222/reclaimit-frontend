import { useContext, useEffect, useState, Suspense, useRef, useLayoutEffect } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { Button, Container, Divider, Typography, Box, Card, TextField, Skeleton, CardContent, CardMedia, Chip, Alert, Collapse, Grid, Stack, Grid2, useTheme } from '@mui/material'
import { AppContext } from '../App';
import { HomeRounded, LoginRounded, NewReleasesRounded, SearchRounded, WarningRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import { useSnackbar } from "notistack";


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
            <Container maxWidth="xl">

            </Container>
        </>
    )
}


export default Home