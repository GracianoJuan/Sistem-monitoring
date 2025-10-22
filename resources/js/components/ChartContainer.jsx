const ChartContainer = ({chart}) => {
    return (
        <div className="@container border-1 rounded-lg shadow-md">
            
            <div>+</div>
            <div>{chart}</div>
        </div>
    )
}

export { ChartContainer };